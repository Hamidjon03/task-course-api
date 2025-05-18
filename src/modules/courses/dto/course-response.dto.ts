import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CourseResponseDto {
  @ApiProperty({
    description: 'Course ID',
    example: '682967986d5df0e1ae1fb624',
  })
  _id: string;

  @ApiProperty({
    description: 'Course title',
    example: 'Advanced JavaScript Programming',
  })
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: 'Learn advanced JavaScript concepts and patterns',
  })
  description: string;

  @ApiProperty({
    description: 'Course start date',
    example: '2025-06-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Course end date',
    example: '2025-08-31T00:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Course creation date',
    example: '2025-05-18T07:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Course last update date',
    example: '2025-05-18T07:30:00.000Z',
  })
  updatedAt: Date;
}

// Base response DTO for a single course
export class CourseDataResponseDto {
  @ApiProperty({
    description: 'Course information',
    type: CourseResponseDto,
  })
  course: CourseResponseDto;
}

// Response DTO for multiple courses
export class CoursesDataResponseDto {
  @ApiProperty({
    description: 'List of courses',
    type: [CourseResponseDto],
  })
  courses: CourseResponseDto[];
}

// Base response structure
export class CourseBaseResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Course successfully created',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  statusCode: number;
}

// Create course response
export class CreateCourseResponseDto extends CourseBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  override statusCode: number = 201;

  @ApiProperty({
    description: 'Response message',
    example: 'Course successfully created',
  })
  override message: string = 'Course successfully created';

  @ApiProperty({
    description: 'Response data',
    type: CourseDataResponseDto,
  })
  data: CourseDataResponseDto;
}

// Get all courses response
export class GetCoursesResponseDto extends CourseBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Courses retrieved successfully',
  })
  override message: string = 'Courses retrieved successfully';

  @ApiProperty({
    description: 'Response data',
    type: CoursesDataResponseDto,
  })
  data: CoursesDataResponseDto;
}

// Get single course response
export class GetCourseResponseDto extends CourseBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Course retrieved successfully',
  })
  override message: string = 'Course retrieved successfully';

  @ApiProperty({
    description: 'Response data',
    type: CourseDataResponseDto,
  })
  data: CourseDataResponseDto;
}

// Update course response
export class UpdateCourseResponseDto extends CourseBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Course updated successfully',
  })
  override message: string = 'Course updated successfully';

  @ApiProperty({
    description: 'Response data',
    type: CourseDataResponseDto,
  })
  data: CourseDataResponseDto;
}

// Delete course response
export class DeleteCourseResponseDto extends CourseBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Course deleted successfully',
  })
  override message: string = 'Course deleted successfully';

  @ApiProperty({
    description: 'Response data',
    type: CourseDataResponseDto,
  })
  data: CourseDataResponseDto;
}