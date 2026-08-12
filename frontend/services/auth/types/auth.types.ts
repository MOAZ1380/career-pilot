// ====================
// User
// ====================

export interface CurrentUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ====================
// Login
// ====================

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: CurrentUserDto;
  };
}

// ====================
// Register
// ====================

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: null;
}

// ====================
// Verify Email
// ====================

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: null;
}

// ====================
// Resend Verification OTP
// ====================

export interface ResendVerificationOtpDto {
  email: string;
}

export interface ResendVerificationOtpResponse {
  success: boolean;
  message: string;
  data: null;
}

// ====================
// Current User
// ====================

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: CurrentUserDto;
}

// ====================
// Forgot Password
// ====================

export interface ForgotPasswordDto {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

// ====================
// Verify Reset OTP
// ====================

export interface VerifyResetOtpDto {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  success: boolean;
  message: string;
  data: {
    resetToken: string;
  };
}

// ====================
// Reset Password
// ====================

export interface ResetPasswordDto {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

// ====================
// Generic Response
// ====================

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}
