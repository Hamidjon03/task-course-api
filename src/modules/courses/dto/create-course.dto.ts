import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Advanced JavaScript Programming',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: 'Learn advanced JavaScript concepts and patterns',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Course start date',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Course end date',
    example: '2025-08-31T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
