import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const newTask = await this.taskModel.create({
        ...createTaskDto,
        createdBy: userId,
      });
      
      return {
        data: {
          task: newTask
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(userId: string) {
    const tasks = await this.taskModel.find({ createdBy: userId }).exec();
    
    return {
      data: {
        tasks: tasks
      }
    };
  }

  async findOne(id: string, userId: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid task ID format');
    }
    
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    // Check if the task belongs to the user
    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException(`You don't have permission to access this task`);
    }
    
    return {
      data: {
        task: task
      }
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid task ID format');
    }
    
    // First check if the task exists
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    // Check if the task belongs to the user
    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException(`You don't have permission to modify this task`);
    }
    
    // Now update the task
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    
    return {
      data: {
        task: updatedTask
      }
    };
  }

  async remove(id: string, userId: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid task ID format');
    }
    
    // First check if the task exists
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    // Check if the task belongs to the user
    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException(`You don't have permission to delete this task`);
    }
    
    // Now delete the task
    const deletedTask = await this.taskModel
      .findByIdAndDelete(id)
      .exec();
    
    return {
      data: {
        task: deletedTask
      }
    };
  }
}
