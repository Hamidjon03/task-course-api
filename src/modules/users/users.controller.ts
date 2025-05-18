import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input'
  })
  @ResponseMessage('User successfully created')
  @Post()
  @Roles(UserRole.STUDENT)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully'
  })
  @ResponseMessage('Users retrieved successfully')
  @Get()
  @Roles(UserRole.STUDENT)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ResponseMessage('User retrieved successfully')
  @Get(':id')
  @Roles(UserRole.STUDENT)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ResponseMessage('User updated successfully')
  @Patch(':id')
  @Roles(UserRole.STUDENT)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ResponseMessage('User deleted successfully')
  @Delete(':id')
  @Roles(UserRole.STUDENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}