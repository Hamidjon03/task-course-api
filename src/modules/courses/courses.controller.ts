import { Controller, Get, Post, Body, Put, Param, Delete, HttpStatus, UseGuards, Req, ConflictException, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { 
  CreateCourseResponseDto, 
  GetCoursesResponseDto, 
  GetCourseResponseDto, 
  UpdateCourseResponseDto, 
  DeleteCourseResponseDto,
  RegisterCourseResponseDto,
  GetStudentCoursesResponseDto
} from './dto/course-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Create a new course (admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Course successfully created',
    type: CreateCourseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Not an admin'
  })
  @ResponseMessage('Course successfully created')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN)
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

  @ApiOperation({ summary: 'Update a course (admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course updated successfully',
    type: UpdateCourseResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Course not found'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Not an admin'
  })
  @ResponseMessage('Course updated successfully')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @ApiOperation({ summary: 'Delete a course (admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course deleted successfully',
    type: DeleteCourseResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Course not found'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Not an admin'
  })
  @ResponseMessage('Course deleted successfully')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @ApiOperation({ summary: 'Register the authenticated student for a course' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully registered for the course',
    type: RegisterCourseResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Course not found'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Already registered for this course'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID to register for' })
  @ResponseMessage('Successfully registered for the course')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.STUDENT)
  @Post(':courseId/register')
  registerForCourse(@Param('courseId') courseId: string, @Req() req) {
    return this.coursesService.registerStudentForCourse(courseId, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all courses a student is registered in' })
  @ApiResponse({ 
    status: 200, 
    description: 'Student courses retrieved successfully',
    type: GetStudentCoursesResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Student not found'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Can only view your own courses unless admin'
  })
  @ApiParam({ name: 'studentId', description: 'Student ID to get courses for' })
  @ResponseMessage('Student courses retrieved successfully')
  @ApiBearerAuth('JWT-auth')
  @Get('student/:studentId')
  getStudentCourses(@Param('studentId') studentId: string, @Req() req) {
    // Check if user is requesting their own courses or is an admin
    if (req.user.userId !== studentId && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view your own registered courses');
    }
    return this.coursesService.getStudentCourses(studentId);
  }
}
