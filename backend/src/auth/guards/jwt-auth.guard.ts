import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Protects routes to ensure only authenticated users can access them
 * Uses Passport's JWT strategy for validation
 *
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * @Get('me')
 * getMe() { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Passport's built-in JWT guard handles everything
  // We extend it to allow for custom logic if needed in future
}
