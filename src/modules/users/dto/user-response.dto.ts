// src/modules/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';

export class UserDto {
  @ApiProperty({ example: '60d21b4667d0d8992e610c85', description: 'User ID' })
  _id: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ 
    example: 'student', 
    description: 'User role',
    enum: UserRole
  })
  role: UserRole;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'User successfully created' })
  message: string;

  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class GetUserResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User retrieved successfully' })
  message: string;

  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class GetUsersResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Users retrieved successfully' })
  message: string;

  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}

export class UpdateUserResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User updated successfully' })
  message: string;

  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User deleted successfully' })
  message: string;

  @ApiProperty({ type: UserDto })
  data: UserDto;
}