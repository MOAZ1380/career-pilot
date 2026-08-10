/**
 * DTO for current user information
 * Response DTO - sanitized user data without sensitive fields
 */
export class CurrentUserDto {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
