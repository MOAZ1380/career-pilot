import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from '../../common/validators/match-passwords.validator';

/**
 * DTO for password reset
 * Validates email, reset token, new password, and password confirmation
 */
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  resetToken: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
    message:
      'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password')
  confirmPassword: string;
}
