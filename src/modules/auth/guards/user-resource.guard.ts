import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UserResourceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = request.params.id;

    // Allow admins to access all user resources
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // For students, only allow access to their own resources
    if (user.role === UserRole.STUDENT && user.userId.toString() === userId) {
      return true;
    }

    // Throw forbidden exception instead of returning false
    // This provides a clearer error message
    throw new ForbiddenException('You do not have permission to access or modify this user');
  }
}
