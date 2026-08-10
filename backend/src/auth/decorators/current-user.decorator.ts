import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtAccessPayload } from '../interfaces/jwt-payload.interface';

/**
 * CurrentUser Decorator
 * Extracts and provides the current user from JWT payload
 *
 * Usage:
 * @Get('me')
 * getMe(@CurrentUser() user: JwtAccessPayload) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtAccessPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
