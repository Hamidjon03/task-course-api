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
    const task = await this.findTaskAndVerifyOwner(id, userId);
    
    return {
      data: {
        task: task
      }
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findTaskAndVerifyOwner(id, userId);
    
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
    const task = await this.findTaskAndVerifyOwner(id, userId);
    
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

  /**
   * Finds task by ID, validates the task ID format, and checks ownership
   * @param id Task ID to find
   * @param userId User ID to check ownership
   * @returns Task document if found and verified
   * @throws BadRequestException if ID format is invalid
   * @throws NotFoundException if task not found
   * @throws ForbiddenException if user doesn't have permission
   */
  private async findTaskAndVerifyOwner(
    id: string,
    userId: string,
  ): Promise<TaskDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid task ID format');
    }

    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const taskCreatorId = task.createdBy.toString().trim();
    const requestUserId = userId.toString().trim();

    if (taskCreatorId !== requestUserId) {
      throw new ForbiddenException(
        `You don't have permission to access this task`,
      );
    }

    return task;
  }
}
