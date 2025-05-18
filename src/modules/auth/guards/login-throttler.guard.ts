import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  // Custom rate limit values for login
  protected limit = 5;
  protected ttl = 60000; // 60 seconds in milliseconds

  // Override the getTracker method to use IP address
  protected override getTracker(req: Record<string, any>): Promise<string> {
    // Use IP address as the tracker for rate limiting
    // This is more secure than using the user ID as it prevents
    // attackers from bypassing rate limits by changing user IDs
    return Promise.resolve(req.ip);
  }

  // Custom error handler for login throttling with correct signature
  protected override async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    // Custom error message for login rate limiting
    throw new ThrottlerException(
      `Too many login attempts. Please try again after ${Math.ceil(this.ttl / 60000)} minute(s).`
    );
  }
}