import api from "@/lib/axios";
import { setAccessToken, clearAccessToken } from "@/lib/auth-token";
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  VerifyEmailDto,
  ResendVerificationOtpDto,
  CurrentUserResponse,
  ForgotPasswordDto,
  VerifyResetOtpDto,
  ResetPasswordDto,
  LogoutResponse,
  LogoutAllResponse,
  ForgotPasswordResponse,
  VerifyResetOtpResponse,
  ResetPasswordResponse,
} from "../types/auth.types";

// Login
export const login = async (dto: LoginDto) => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", dto);

    const accessToken = response.data.data.accessToken;

    setAccessToken(accessToken);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register
export const register = async (dto: RegisterDto) => {
  try {
    const response = await api.post("/auth/register", dto);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify Email
export const verifyEmail = async (dto: VerifyEmailDto) => {
  try {
    const response = await api.post("/auth/verify-email", dto);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Resend Verification OTP
export const resendVerificationOtp = async (dto: ResendVerificationOtpDto) => {
  try {
    const response = await api.post("/auth/resend-verification-otp", dto);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const response = await api.get<CurrentUserResponse>("/auth/me");

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout current device
export const logout = async () => {
  try {
    const response = await api.post<LogoutResponse>("/auth/logout");

    return response.data;
  } finally {
    clearAccessToken();
  }
};

// Logout all devices
export const logoutAll = async () => {
  try {
    const response = await api.post<LogoutAllResponse>("/auth/logout-all");

    return response.data;
  } finally {
    clearAccessToken();
  }
};

// Forgot Password
export const forgotPassword = async (dto: ForgotPasswordDto) => {
  try {
    const response = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      dto,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify Reset OTP
export const verifyResetOtp = async (dto: VerifyResetOtpDto) => {
  try {
    const response = await api.post<VerifyResetOtpResponse>(
      "/auth/verify-reset-otp",
      dto,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset Password
export const resetPassword = async (dto: ResetPasswordDto) => {
  try {
    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      dto,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
