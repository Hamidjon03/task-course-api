import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from 'src/common/enums/task-status.enum';
import { Types } from 'mongoose';

export class TaskResponseDto {
  @ApiProperty({
    description: 'Task ID',
    example: '682967986d5df0e1ae1fb623',
  })
  _id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Write detailed documentation for the API endpoints',
  })
  description: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Task due date',
    example: '2025-06-01T00:00:00.000Z',
  })
  dueDate: Date;

  @ApiProperty({
    description: 'User ID who created the task',
    example: '682967986d5df0e1ae1fb622',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Task creation date',
    example: '2025-05-18T07:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Task last update date',
    example: '2025-05-18T07:30:00.000Z',
  })
  updatedAt: Date;
}

// Base response DTO for a single task
export class TaskDataResponseDto {
  @ApiProperty({
    description: 'Task information',
    type: TaskResponseDto,
  })
  task: TaskResponseDto;
}

// Response DTO for multiple tasks
export class TasksDataResponseDto {
  @ApiProperty({
    description: 'List of tasks',
    type: [TaskResponseDto],
  })
  tasks: TaskResponseDto[];
}

// Base response structure
export class TaskBaseResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Task successfully created',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  statusCode: number;
}

// Create task response
export class CreateTaskResponseDto extends TaskBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  override statusCode: number = 201;

  @ApiProperty({
    description: 'Response message',
    example: 'Task successfully created',
  })
  override message: string = 'Task successfully created';

  @ApiProperty({
    description: 'Response data',
    type: TaskDataResponseDto,
  })
  data: TaskDataResponseDto;
}

// Get all tasks response
export class GetTasksResponseDto extends TaskBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Tasks retrieved successfully',
  })
  override message: string = 'Tasks retrieved successfully';

  @ApiProperty({
    description: 'Response data',
    type: TasksDataResponseDto,
  })
  data: TasksDataResponseDto;
}

// Get single task response
export class GetTaskResponseDto extends TaskBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Task retrieved successfully',
  })
  override message: string = 'Task retrieved successfully';

  @ApiProperty({
    description: 'Response data',
    type: TaskDataResponseDto,
  })
  data: TaskDataResponseDto;
}

// Update task response
export class UpdateTaskResponseDto extends TaskBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Task updated successfully',
  })
  override message: string = 'Task updated successfully';

  @ApiProperty({
    description: 'Response data',
    type: TaskDataResponseDto,
  })
  data: TaskDataResponseDto;
}

// Delete task response
export class DeleteTaskResponseDto extends TaskBaseResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  override statusCode: number = 200;

  @ApiProperty({
    description: 'Response message',
    example: 'Task deleted successfully',
  })
  override message: string = 'Task deleted successfully';

  @ApiProperty({
    description: 'Response data',
    type: TaskDataResponseDto,
  })
  data: TaskDataResponseDto;
}
