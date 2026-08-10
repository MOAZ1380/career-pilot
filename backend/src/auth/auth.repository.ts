import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshToken } from '@prisma/client';

/**
 * AuthRepository handles authentication-related database operations
 * Encapsulates Prisma queries for refresh tokens and other auth data
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new refresh token record
   * @param userId - User ID
   * @param tokenHash - Hashed refresh token
   * @param expiresAt - Token expiration time
   * @returns Created refresh token record
   */
  async createRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  /**
   * Find refresh token by ID
   * @param id - Refresh token ID
   * @returns Refresh token or null if not found
   */
  async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { id },
    });
  }

  /**
   * Find all refresh tokens for a user
   * @param userId - User ID
   * @returns Array of refresh tokens
   */
  async findUserRefreshTokens(userId: string): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany({
      where: { userId },
    });
  }

  /**
   * Find valid (not expired) refresh tokens for a user
   * @param userId - User ID
   * @returns Array of valid refresh tokens
   */
  async findValidRefreshTokens(userId: string): Promise<RefreshToken[]> {
    const now = new Date();

    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        expiresAt: {
          gt: now,
        },
      },
    });
  }

  /**
   * Delete a refresh token by ID
   * @param id - Refresh token ID
   * @returns Deleted refresh token
   */
  async deleteRefreshToken(id: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  /**
   * Delete all refresh tokens for a user
   * Used during logout-all operation
   * @param userId - User ID
   * @returns Number of deleted tokens
   */
  async deleteUserRefreshTokens(userId: string): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  /**
   * Delete expired refresh tokens for cleanup
   * Useful for database maintenance
   * @returns Number of deleted tokens
   */
  async deleteExpiredRefreshTokens(): Promise<number> {
    const now = new Date();

    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    return result.count;
  }

  /**
   * Find any valid refresh token for a user (for verification)
   * @param userId - User ID
   * @returns First valid refresh token or null
   */
  async findFirstValidRefreshToken(
    userId: string,
  ): Promise<RefreshToken | null> {
    const now = new Date();

    return this.prisma.refreshToken.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: now,
        },
      },
    });
  }

  /**
   * Count valid refresh tokens for a user
   * Useful for device management
   * @param userId - User ID
   * @returns Number of valid tokens
   */
  async countValidRefreshTokens(userId: string): Promise<number> {
    const now = new Date();

    return this.prisma.refreshToken.count({
      where: {
        userId,
        expiresAt: {
          gt: now,
        },
      },
    });
  }
}
