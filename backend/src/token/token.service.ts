import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import {
  JwtAccessPayload,
  JwtRefreshPayload,
  JwtResetPayload,
} from '../auth/interfaces/jwt-payload.interface';

/**
 * TokenService handles all JWT token operations
 * Responsible for:
 * - Generating access, refresh, and reset tokens
 * - Verifying tokens
 * - Hashing and comparing refresh tokens
 */
@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly resetSecret: string;
  private readonly accessExpiration: StringValue;
  private readonly refreshExpiration: StringValue;
  private readonly resetExpiration: StringValue;
  private readonly bcryptSaltRounds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret = this.configService.getOrThrow('JWT_ACCESS_SECRET');
    this.refreshSecret = this.configService.getOrThrow('JWT_REFRESH_SECRET');
    this.resetSecret = this.configService.getOrThrow('JWT_RESET_SECRET');
    this.accessExpiration = this.configService.getOrThrow(
      'JWT_ACCESS_EXPIRES_IN',
    ) as StringValue;
    this.refreshExpiration = this.configService.getOrThrow(
      'JWT_REFRESH_EXPIRES_IN',
    ) as StringValue;
    this.resetExpiration = this.configService.getOrThrow(
      'JWT_RESET_EXPIRES_IN',
    ) as StringValue;
    this.bcryptSaltRounds = parseInt(
      this.configService.getOrThrow('BCRYPT_SALT_ROUNDS') || '12',
      10,
    );
  }

  /**
   * Generate access token (short-lived)
   * Expiration: 15 minutes
   * @param userId - User ID to encode in token
   * @param email - User email to encode in token
   * @returns Access token string
   */
  generateAccessToken(userId: string, email: string): string {
    const payload: JwtAccessPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiration,
    });
  }

  /**
   * Generate refresh token (long-lived)
   * Expiration: 7 days
   * @param userId - User ID to encode in token
   * @returns Refresh token string
   */
  generateRefreshToken(userId: string): string {
    const payload: JwtRefreshPayload = {
      sub: userId,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiration,
    });
  }

  /**
   * Generate reset token (short-lived, single-use)
   * Expiration: 15 minutes
   * @param userId - User ID to encode in token
   * @param email - User email to encode in token
   * @returns Reset token string
   */
  generateResetToken(userId: string, email: string): string {
    const payload: JwtResetPayload = {
      sub: userId,
      email,
      type: 'reset',
    };

    return this.jwtService.sign(payload, {
      secret: this.resetSecret,
      expiresIn: this.resetExpiration,
    });
  }

  /**
   * Verify access token and extract payload
   * @param token - Token to verify
   * @returns Decoded payload if valid
   * @throws If token is invalid or expired
   */
  verifyAccessToken(token: string): JwtAccessPayload {
    return this.jwtService.verify(token, {
      secret: this.accessSecret,
    }) as JwtAccessPayload;
  }

  /**
   * Verify refresh token and extract payload
   * @param token - Token to verify
   * @returns Decoded payload if valid
   * @throws If token is invalid or expired
   */
  verifyRefreshToken(token: string): JwtRefreshPayload {
    return this.jwtService.verify(token, {
      secret: this.refreshSecret,
    }) as JwtRefreshPayload;
  }

  /**
   * Verify reset token and extract payload
   * @param token - Token to verify
   * @returns Decoded payload if valid
   * @throws If token is invalid or expired
   */
  verifyResetToken(token: string): JwtResetPayload {
    return this.jwtService.verify(token, {
      secret: this.resetSecret,
    }) as JwtResetPayload;
  }

  /**
   * Hash a refresh token for secure storage
   * Never store plaintext refresh tokens in database
   * @param token - Plaintext refresh token
   * @param saltRounds - Number of salt rounds
   * @returns Hashed token
   */
  async hashRefreshToken(token: string, saltRounds?: number): Promise<string> {
    return bcrypt.hash(token, saltRounds || this.bcryptSaltRounds);
  }

  /**
   * Compare plaintext refresh token with stored hash
   * @param token - Plaintext token to compare
   * @param hash - Hashed token from database
   * @returns Whether tokens match
   */
  async compareRefreshTokens(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }

  /**
   * Extract user ID from access token without verification
   * Used for debugging/logging only
   * @param token - Token to decode
   * @returns Decoded payload or null if invalid
   */
  decodeToken(token: string): JwtAccessPayload | null {
    try {
      return this.jwtService.decode(token) as JwtAccessPayload;
    } catch {
      return null;
    }
  }
}
