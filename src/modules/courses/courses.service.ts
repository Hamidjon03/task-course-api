import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ConflictException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async registerStudentForCourse(courseId: string, userId: string) {
    if (!isValidObjectId(courseId) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid ID format');
    }

    // Check if course exists
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check if user exists
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user is already registered for this course
    if (user.registeredCourses.includes(new Types.ObjectId(courseId))) {
      throw new ConflictException('You are already registered for this course');
    }

    // Add course to user's registered courses
    user.registeredCourses.push(new Types.ObjectId(courseId));
    await user.save();

    return {
      data: {
        course: course
      }
    };
  }

  async getStudentCourses(studentId: string) {
    if (!isValidObjectId(studentId)) {
      throw new BadRequestException('Invalid student ID format');
    }

    // Check if user exists
    const user = await this.userModel.findById(studentId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${studentId} not found`);
    }

    // Get all courses the student is registered for
    const courses = await this.courseModel
      .find({ _id: { $in: user.registeredCourses } })
      .exec();

    return {
      data: {
        courses: courses,
        studentId: studentId
      }
    };
  }
}
