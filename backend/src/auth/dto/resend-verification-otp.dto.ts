import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for resending verification OTP
 * Validates email address
 */
export class ResendVerificationOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
