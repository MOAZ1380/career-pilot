import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * DTO for email verification
 * Validates email and OTP code
 */
export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp: string;
}
