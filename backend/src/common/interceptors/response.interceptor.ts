import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Global Response Interceptor
 * Wraps all responses in a consistent format
 * Ensures all endpoints return { success, message, data } structure
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // If response already has success field, return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Otherwise wrap in standard format
        return {
          success: true,
          message: 'Request successful',
          data,
        };
      }),
    );
  }
}
