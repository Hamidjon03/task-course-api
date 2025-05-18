import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  CreateTaskResponseDto, 
  GetTasksResponseDto, 
  GetTaskResponseDto, 
  UpdateTaskResponseDto, 
  DeleteTaskResponseDto 
} from './dto/task-response.dto';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ 
    status: 201, 
    description: 'Task successfully created',
    type: CreateTaskResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input'
  })
  @ResponseMessage('Task successfully created')
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tasks retrieved successfully',
    type: GetTasksResponseDto
  })
  @ResponseMessage('Tasks retrieved successfully')
  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Task retrieved successfully',
    type: GetTaskResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found'
  })
  @ResponseMessage('Task retrieved successfully')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ 
    status: 200, 
    description: 'Task updated successfully',
    type: UpdateTaskResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found'
  })
  @ResponseMessage('Task updated successfully')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ 
    status: 200, 
    description: 'Task deleted successfully',
    type: DeleteTaskResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found'
  })
  @ResponseMessage('Task deleted successfully')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.tasksService.remove(id, req.user.userId);
  }
}
