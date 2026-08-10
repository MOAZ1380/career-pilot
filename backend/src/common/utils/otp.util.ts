import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

/**
 * Utility class for OTP (One-Time Password) operations
 * Handles secure OTP generation, hashing, and verification
 */
export class OtpUtil {
  private static readonly OTP_LENGTH = 6;
  private static readonly SALT_ROUNDS = 10;

  /**
   * Generate a cryptographically secure 6-digit OTP
   * Uses crypto.randomInt for secure random generation
   * @returns 6-digit OTP as string (padded with zeros if necessary)
   */
  static generateOtp(): string {
    // Generate random number between 0 and 999999
    const otp = crypto.randomInt(0, 1000000);
    // Pad with zeros to ensure 6 digits
    return otp.toString().padStart(this.OTP_LENGTH, '0');
  }

  /**
   * Hash an OTP using bcrypt
   * @param otp - OTP to hash
   * @param saltRounds - Number of salt rounds (default: 10)
   * @returns Hashed OTP
   */
  static async hash(
    otp: string,
    saltRounds: number = this.SALT_ROUNDS,
  ): Promise<string> {
    return bcrypt.hash(otp, saltRounds);
  }

  /**
   * Verify OTP against hash
   * @param otp - Plaintext OTP
   * @param hash - Hashed OTP to verify against
   * @returns Whether OTP is valid
   */
  static async verify(otp: string, hash: string): Promise<boolean> {
    return bcrypt.compare(otp, hash);
  }

  /**
   * Check if OTP has expired
   * @param expiresAt - Expiration timestamp
   * @returns Whether OTP has expired
   */
  static isExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Calculate OTP expiration time (current time + 10 minutes)
   * @returns Expiration datetime
   */
  static calculateExpiration(): Date {
    const now = new Date();
    return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
  }
}
