import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto, LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: RegisterResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - User with this email already exists or invalid input'
  })
  @ResponseMessage('User successfully registered')
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials'
  })
  @ResponseMessage('User successfully logged in')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}