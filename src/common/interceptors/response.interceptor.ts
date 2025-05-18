import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    
    // Get custom message from handler metadata if it exists
    const customMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: customMessage || 'Request successful',
        statusCode: response.statusCode,
        data,
      })),
    );
  }
}