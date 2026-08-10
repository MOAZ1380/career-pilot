import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * DTO for verifying password reset OTP
 * Validates email and OTP code
 */
export class VerifyResetOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp: string;
}
