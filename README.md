# Task and Course Management API

A RESTful API built with NestJS, TypeScript, and MongoDB that provides task management and course registration functionality with JWT authentication.

## Features

- 🔐 **Authentication**: JWT-based authentication with register and login endpoints
- 📋 **Task Management**: Create, read, update, and delete tasks with user-specific access control
- 📚 **Course Management**: Course creation (admin only) and student registration
- 👥 **User Roles**: Admin and Student role-based access control
- 📝 **API Documentation**: Swagger UI for easy API exploration and testing

## Tech Stack

- **Backend Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator and class-transformer
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-course-api
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   > **Note**: The `--legacy-peer-deps` flag is necessary to resolve some dependency conflicts with the latest NestJS version.

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to configure your MongoDB connection and JWT settings.

4. Seed the database with initial data:
   ```bash
   npm run seed
   ```
   This will create an admin user with the following credentials:
   - Email: admin@example.com
   - Password: password123

5. Start the application:
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/docs
```

The Swagger UI provides a comprehensive interface to explore and test all available endpoints.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Task Management

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - List all tasks for the authenticated user
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Course Management

- `POST /api/courses` - Create a new course (admin only)
- `GET /api/courses` - List all available courses
- `GET /api/courses/:id` - Get a specific course
- `PUT /api/courses/:id` - Update a course (admin only)
- `DELETE /api/courses/:id` - Delete a course (admin only)
- `POST /api/courses/:courseId/register` - Register the authenticated student for a course
- `GET /api/courses/student/:studentId` - View all courses a student is registered in

### User Management

- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get a specific user
- `PATCH /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Core Logic

### Task Management

- Tasks are user-specific; users can only view, edit, and delete their own tasks
- Tasks have a status lifecycle: pending → in-progress → done
- TasksService handles CRUD operations with proper permission checks

### Course Management

- Only admins can create, update, and delete courses
- Students can register for multiple courses but cannot register for the same course twice
- When a student registers for a course, the course reference is added to the student's registeredCourses array
- CoursesService handles course management and registration logic

### User Authentication

- LoginThrottlerGuard provides rate limiting for login attempts to prevent brute force attacks
- JwtAuthGuard protects routes that require authentication
- RolesGuard enforces role-based access control for admin-only endpoints

### Security Features

- **Rate Limiting**: The API implements rate limiting to protect against abuse and DOS attacks:
  - Global rate limiting of 5 requests per minute for all API endpoints
  - Specific stricter rate limiting for login endpoint to prevent brute force attacks
  - Custom error responses that indicate remaining time before retry is allowed

