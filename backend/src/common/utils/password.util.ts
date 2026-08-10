import * as bcrypt from 'bcrypt';

/**
 * Utility class for password operations
 * Handles hashing and verification with secure practices
 */
export class PasswordUtil {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash a plaintext password using bcrypt
   * @param password - Plaintext password to hash
   * @param saltRounds - Number of salt rounds (default: 12)
   * @returns Hashed password
   */
  static async hash(
    password: string,
    saltRounds: number = this.SALT_ROUNDS,
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plaintext password with hashed password
   * @param password - Plaintext password to compare
   * @param hash - Hashed password to compare against
   * @returns Whether passwords match
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate password meets security requirements
   * Requirements:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   *
   * @param password - Password to validate
   * @returns Whether password meets requirements
   */
  static validatePassword(password: string): boolean {
    if (!password || password.length < 8) {
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  /**
   * Get password validation error message
   * @param password - Password to validate
   * @returns Error message or empty string if valid
   */
  static getPasswordValidationError(password: string): string {
    if (!password) {
      return 'Password is required';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)';
    }

    return '';
  }
}
