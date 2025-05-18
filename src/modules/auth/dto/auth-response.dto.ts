import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '682967986d5df0e1ae1fb622',
  })
  _id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example1.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  role: UserRole;
}

// Base response DTO for registration (without token)
export class UserDataResponseDto {
  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

// Login response DTO (with token)
export class LoginDataResponseDto extends UserDataResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'User successfully logged in',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response data',
    type: UserDataResponseDto,
  })
  data: UserDataResponseDto;
}

export class RegisterResponseDto extends AuthResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  override statusCode: number = 201;

  @ApiProperty({
    description: 'Response message',
    example: 'User successfully registered',
  })
  override message: string = 'User successfully registered';

  @ApiProperty({
    description: 'Response data',
    type: UserDataResponseDto,
  })
  declare data: UserDataResponseDto;
}

export class LoginResponseDto extends AuthResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'User successfully logged in',
  })
  override message: string = 'User successfully logged in';
  
  @ApiProperty({
    description: 'Response data',
    type: LoginDataResponseDto,
  })
  declare data: LoginDataResponseDto;
}