import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  // Override the default ttl and limit for login attempts
  protected readonly throttler = {
    ttl: 60, // Time window in seconds (1 minute)
    limit: 5, // Max 5 login attempts per minute
  };

  protected override getTracker(req: Record<string, any>): Promise<string> {
    // Use IP address as the tracker for rate limiting
    // This is more secure than using the user ID as it prevents
    // attackers from bypassing rate limits by changing user IDs
    return Promise.resolve(req.ip);
  }

  // Override the handleRequest method to provide a custom error message
  async handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: any, getTracker: any, generateKey: any): Promise<boolean> {
    try {
      // Override the limit and ttl with our custom values
      const customLimit = this.throttler.limit;
      const customTtl = this.throttler.ttl;
      
      return await super.handleRequest(context, customLimit, customTtl, throttler, getTracker, generateKey);
    } catch (error) {
      if (error instanceof ThrottlerException) {
        // Customize the error message for login rate limiting
        throw new ThrottlerException(
          `Too many login attempts. Please try again after ${Math.ceil(this.throttler.ttl / 60)} minute(s).`
        );
      }
      throw error;
    }
  }
}