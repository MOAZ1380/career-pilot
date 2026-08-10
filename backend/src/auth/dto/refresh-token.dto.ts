import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for token refresh
 * Validates refresh token
 */
export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
