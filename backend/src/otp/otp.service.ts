import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpUtil } from '../common/utils/otp.util';
import { OtpPurpose } from '@prisma/client';

/**
 * OtpService handles OTP-related operations
 * Responsible for:
 * - Generating secure OTPs
 * - Storing hashed OTPs
 * - Verifying OTPs with attempt tracking
 * - OTP expiration handling
 * - OTP cooldown management
 */
@Injectable()
export class OtpService {
  private readonly maxAttempts = 5;
  private readonly resendCooldownSeconds = 60;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new OTP for a user
   * Automatically invalidates previous OTPs of the same purpose
   * @param userId - User ID
   * @param purpose - OTP purpose (EMAIL_VERIFICATION or PASSWORD_RESET)
   * @returns Generated OTP (plaintext)
   */
  async createOtp(userId: string, purpose: OtpPurpose): Promise<string> {
    const otp = OtpUtil.generateOtp();
    const codeHash = await OtpUtil.hash(otp);
    const expiresAt = OtpUtil.calculateExpiration();

    // Delete previous OTPs for this purpose
    await this.prisma.otp.deleteMany({
      where: {
        userId,
        purpose,
      },
    });

    // Create new OTP
    await this.prisma.otp.create({
      data: {
        userId,
        codeHash,
        purpose,
        expiresAt,
        attempts: 0,
      },
    });

    return otp;
  }

  /**
   * Verify OTP against stored hash
   * Increments attempts and checks limits
   * @param userId - User ID
   * @param otpCode - OTP code provided by user
   * @param purpose - OTP purpose
   * @returns Whether OTP is valid
   */
  async verifyOtp(
    userId: string,
    otpCode: string,
    purpose: OtpPurpose,
  ): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    // OTP not found
    if (!otp) {
      return false;
    }

    // Check expiration
    if (OtpUtil.isExpired(otp.expiresAt)) {
      return false;
    }

    // Check attempt limit before verifying
    if (otp.attempts >= this.maxAttempts) {
      return false;
    }

    // Verify OTP hash
    const isValid = await OtpUtil.verify(otpCode, otp.codeHash);

    if (!isValid) {
      // Increment attempts only on failed verification
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { attempts: otp.attempts + 1 },
      });

      // Invalidate if max attempts exceeded
      if (otp.attempts + 1 >= this.maxAttempts) {
        await this.prisma.otp.delete({
          where: { id: otp.id },
        });
      }

      return false;
    }

    return true;
  }

  /**
   * Invalidate/delete OTP after successful verification
   * @param userId - User ID
   * @param purpose - OTP purpose
   */
  async invalidateOtp(userId: string, purpose: OtpPurpose): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: {
        userId,
        purpose,
      },
    });
  }

  /**
   * Check if user can request a new OTP (respects cooldown)
   * @param userId - User ID
   * @param purpose - OTP purpose
   * @returns Whether cooldown has expired
   */
  async canRequestNewOtp(
    userId: string,
    purpose: OtpPurpose,
  ): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    if (!otp) {
      return true;
    }

    const now = new Date();
    const createdAt = new Date(otp.createdAt);
    const elapsedSeconds = (now.getTime() - createdAt.getTime()) / 1000;

    return elapsedSeconds >= this.resendCooldownSeconds;
  }

  /**
   * Get time until next OTP can be requested (in seconds)
   * @param userId - User ID
   * @param purpose - OTP purpose
   * @returns Seconds until cooldown expires, or 0 if can request now
   */
  async getOtpCooldownRemaining(
    userId: string,
    purpose: OtpPurpose,
  ): Promise<number> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    if (!otp) {
      return 0;
    }

    const now = new Date();
    const createdAt = new Date(otp.createdAt);
    const elapsedSeconds = (now.getTime() - createdAt.getTime()) / 1000;
    const remaining = Math.max(0, this.resendCooldownSeconds - elapsedSeconds);

    return Math.ceil(remaining);
  }

  /**
   * Check if OTP exists and is not expired
   * @param userId - User ID
   * @param purpose - OTP purpose
   * @returns Whether valid OTP exists
   */
  async hasValidOtp(userId: string, purpose: OtpPurpose): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    if (!otp) {
      return false;
    }

    return !OtpUtil.isExpired(otp.expiresAt);
  }

  /**
   * Get OTP information (for admin/debugging - never expose to client)
   * @param userId - User ID
   * @param purpose - OTP purpose
   * @returns OTP data without hash
   */
  async getOtpInfo(
    userId: string,
    purpose: OtpPurpose,
  ): Promise<{
    exists: boolean;
    expired: boolean;
    attempts: number;
    createdAt: Date;
    expiresAt: Date;
  } | null> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        purpose,
      },
    });

    if (!otp) {
      return null;
    }

    return {
      exists: true,
      expired: OtpUtil.isExpired(otp.expiresAt),
      attempts: otp.attempts,
      createdAt: otp.createdAt,
      expiresAt: otp.expiresAt,
    };
  }
}
