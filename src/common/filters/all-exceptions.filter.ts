import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      // Extract the error message properly
      let errorMessage = 'Internal server error';
      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
        if (typeof exceptionResponse === 'string') {
          errorMessage = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
          // Handle both formats: { message: string } and { message: { message: string, ... } }
          const exceptionObj = exceptionResponse as Record<string, any>;
          if (exceptionObj.message) {
            if (typeof exceptionObj.message === 'string') {
              errorMessage = exceptionObj.message;
            } else if (typeof exceptionObj.message === 'object' && exceptionObj.message.message) {
              errorMessage = exceptionObj.message.message;
            }
          }
        }
      } else if (exception instanceof Error) {
        errorMessage = exception.message;
      }
  
      this.logger.error(`❌ [${request.method}] ${request.url}`, exception instanceof Error ? exception.stack : '');
  
      response.status(status).json({
        success: false,
        statusCode: status,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
  