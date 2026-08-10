import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for user login
 * Validates email and password
 */
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
