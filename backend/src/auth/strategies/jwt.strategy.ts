import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessPayload } from '../interfaces/jwt-payload.interface';

/**
 * JWT Strategy for Passport
 * Extracts JWT from Authorization header and validates it
 * Used by JwtAuthGuard to protect routes
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.getOrThrow('JWT_ACCESS_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Validate JWT payload
   * Called by Passport after JWT verification
   * @param payload - Decoded JWT payload
   * @returns Payload if valid
   * @throws UnauthorizedException if payload is invalid
   */
  validate(payload: JwtAccessPayload): JwtAccessPayload {
    if (!payload || !payload.sub || payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }
}
