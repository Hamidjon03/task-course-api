import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { 
  CreateUserResponseDto, 
  GetUserResponseDto, 
  GetUsersResponseDto, 
  UpdateUserResponseDto, 
  DeleteUserResponseDto 
} from './dto/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    type: CreateUserResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input'
  })
  @ResponseMessage('User successfully created')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: GetUsersResponseDto
  })
  @ResponseMessage('Users retrieved successfully')
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }
  
  @ApiOperation({ summary: 'Get a specific user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    type: GetUserResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ResponseMessage('User retrieved successfully')
  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UpdateUserResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid user ID format or invalid input'
  })
  @ResponseMessage('User updated successfully')
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    type: DeleteUserResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid user ID format'
  })
  @ResponseMessage('User deleted successfully')
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}