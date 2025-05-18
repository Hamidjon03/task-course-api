import { Controller, Get, Post, Body, Put, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { 
  CreateCourseResponseDto, 
  GetCoursesResponseDto, 
  GetCourseResponseDto, 
  UpdateCourseResponseDto, 
  DeleteCourseResponseDto 
} from './dto/course-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ 
    status: 201, 
    description: 'Course successfully created',
    type: CreateCourseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input'
  })
  @ResponseMessage('Course successfully created')
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Public()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ 
    status: 200, 
    description: 'Courses retrieved successfully',
    type: GetCoursesResponseDto
  })
  @ResponseMessage('Courses retrieved successfully')
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Public()
  @ApiOperation({ summary: 'Get a specific course by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course retrieved successfully',
    type: GetCourseResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Course not found'
  })
  @ResponseMessage('Course retrieved successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course updated successfully',
    type: UpdateCourseResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Course not found'
  })
  @ResponseMessage('Course updated successfully')
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course deleted successfully',
    type: DeleteCourseResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Course not found'
  })
  @ResponseMessage('Course deleted successfully')
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
