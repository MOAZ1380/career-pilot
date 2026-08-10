import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for forgot password request
 * Validates email address
 */
export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
