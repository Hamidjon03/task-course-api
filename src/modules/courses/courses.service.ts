import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ConflictException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      // Check if a course with the same title already exists
      const existingCourse = await this.courseModel.findOne({ 
        title: createCourseDto.title 
      }).exec();
      
      if (existingCourse) {
        throw new ConflictException(`Course with title "${createCourseDto.title}" already exists`);
      }
      
      const newCourse = await this.courseModel.create({
        ...createCourseDto,
      });
      
      return {
        data: {
          course: newCourse
        }
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create course');
    }
  }

  async findAll() {
    const courses = await this.courseModel.find().exec();
    
    return {
      data: {
        courses: courses
      }
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid course ID format');
    }
    
    const course = await this.courseModel.findById(id).exec();
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    
    return {
      data: {
        course: course
      }
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid course ID format');
    }
    
    // First check if the course exists
    const course = await this.courseModel.findById(id).exec();
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    
    // If title is being updated, check for duplicates
    if (updateCourseDto.title && updateCourseDto.title !== course.title) {
      const existingCourse = await this.courseModel.findOne({ 
        title: updateCourseDto.title,
        _id: { $ne: id } // Exclude current course from the check
      }).exec();
      
      if (existingCourse) {
        throw new ConflictException(`Course with title "${updateCourseDto.title}" already exists`);
      }
    }
    
    // Now update the course
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
    
    return {
      data: {
        course: updatedCourse
      }
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid course ID format');
    }
    
    // First check if the course exists
    const course = await this.courseModel.findById(id).exec();
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    
    // Now delete the course
    const deletedCourse = await this.courseModel
      .findByIdAndDelete(id)
      .exec();
    
    return {
      data: {
        course: deletedCourse
      }
    };
  }
}
