import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { OtpService } from '../otp/otp.service';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { AuthRepository } from './auth.repository';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpPurpose } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let otpService: OtpService;
  let emailService: EmailService;
  let usersService: UsersService;
  let authRepository: AuthRepository;
  let prismaService: PrismaService;

  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: '$2b$12$hashedpassword',
    isVerified: true,
    lastLoginAt: new Date(),
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserUnverified = {
    ...mockUser,
    isVerified: false,
  };

  const mockUserLocked = {
    ...mockUser,
    lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            generateResetToken: jest.fn(),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
            verifyResetToken: jest.fn(),
            hashRefreshToken: jest.fn(),
            compareRefreshTokens: jest.fn(),
          },
        },
        {
          provide: OtpService,
          useValue: {
            createOtp: jest.fn(),
            verifyOtp: jest.fn(),
            invalidateOtp: jest.fn(),
            canRequestNewOtp: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendVerificationEmail: jest.fn(),
            sendResetPasswordEmail: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            verifyPassword: jest.fn(),
            isAccountLocked: jest.fn(),
            handleFailedLogin: jest.fn(),
            handleSuccessfulLogin: jest.fn(),
            emailExists: jest.fn(),
            usernameExists: jest.fn(),
            markAsVerified: jest.fn(),
            sanitizeUser: jest.fn(),
          },
        },
        {
          provide: AuthRepository,
          useValue: {
            createRefreshToken: jest.fn(),
            findRefreshTokenById: jest.fn(),
            findUserRefreshTokens: jest.fn(),
            deleteRefreshToken: jest.fn(),
            deleteUserRefreshTokens: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            user: {
              create: jest.fn(),
              update: jest.fn(),
            },
            otp: {
              deleteMany: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    otpService = module.get<OtpService>(OtpService);
    emailService = module.get<EmailService>(EmailService);
    usersService = module.get<UsersService>(UsersService);
    authRepository = module.get<AuthRepository>(AuthRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const dto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'SecurePass@123',
        confirmPassword: 'SecurePass@123',
      };

      jest.spyOn(usersService, 'emailExists').mockResolvedValueOnce(false);
      jest.spyOn(usersService, 'usernameExists').mockResolvedValueOnce(false);
      jest.spyOn(prismaService, '$transaction').mockResolvedValueOnce({
        user: mockUser,
        otp: '123456',
      });
      jest
        .spyOn(emailService, 'sendVerificationEmail')
        .mockResolvedValueOnce(true);

      const result = await service.register(dto);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'SecurePass@123',
        confirmPassword: 'SecurePass@123',
      };

      jest.spyOn(usersService, 'emailExists').mockResolvedValueOnce(true);

      await expect(service.register(dto)).rejects.toThrow(
        'Email already registered',
      );
    });

    it('should throw ConflictException if username already exists', async () => {
      const dto = {
        username: 'existinguser',
        email: 'newuser@example.com',
        password: 'SecurePass@123',
        confirmPassword: 'SecurePass@123',
      };

      jest.spyOn(usersService, 'emailExists').mockResolvedValueOnce(false);
      jest.spyOn(usersService, 'usernameExists').mockResolvedValueOnce(true);

      await expect(service.register(dto)).rejects.toThrow('Username already taken');
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const dto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'SecurePass@123',
        confirmPassword: 'DifferentPass@123',
      };

      jest.spyOn(usersService, 'emailExists').mockResolvedValueOnce(false);
      jest.spyOn(usersService, 'usernameExists').mockResolvedValueOnce(false);

      await expect(service.register(dto)).rejects.toThrow('Passwords do not match');
    });

    it('should throw BadRequestException if password is weak', async () => {
      const dto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      };

      jest.spyOn(usersService, 'emailExists').mockResolvedValueOnce(false);
      jest.spyOn(usersService, 'usernameExists').mockResolvedValueOnce(false);

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email with valid OTP', async () => {
      const dto = {
        email: 'test@example.com',
        otp: '123456',
      };

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(mockUserUnverified);
      jest.spyOn(otpService, 'verifyOtp').mockResolvedValueOnce(true);
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(undefined);

      const result = await service.verifyEmail(dto);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Email verified successfully');
    });

    it('should throw UnauthorizedException if OTP is invalid', async () => {
      const dto = {
        email: 'test@example.com',
        otp: '999999',
      };

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(mockUserUnverified);
      jest.spyOn(otpService, 'verifyOtp').mockResolvedValueOnce(false);

      await expect(service.verifyEmail(dto)).rejects.toThrow(
        'Invalid or expired OTP',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const dto = {
        email: 'nonexistent@example.com',
        otp: '123456',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);

      await expect(service.verifyEmail(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return success if email already verified', async () => {
      const dto = {
        email: 'test@example.com',
        otp: '123456',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(mockUser);

      const result = await service.verifyEmail(dto);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Email already verified');
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'SecurePass@123',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(usersService, 'isAccountLocked').mockReturnValueOnce(false);
      jest.spyOn(usersService, 'verifyPassword').mockResolvedValueOnce(true);
      jest
        .spyOn(usersService, 'handleSuccessfulLogin')
        .mockResolvedValueOnce(mockUser);
      jest
        .spyOn(tokenService, 'generateAccessToken')
        .mockReturnValueOnce('access-token');
      jest
        .spyOn(tokenService, 'generateRefreshToken')
        .mockReturnValueOnce('refresh-token');
      jest
        .spyOn(tokenService, 'hashRefreshToken')
        .mockResolvedValueOnce('hashed-token');
      jest
        .spyOn(authRepository, 'createRefreshToken')
        .mockResolvedValueOnce({} as any);
      jest.spyOn(usersService, 'sanitizeUser').mockReturnValueOnce({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        isVerified: mockUser.isVerified,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });

      const result = await service.login(dto);

      expect(result.success).toBe(true);
      expect(result.data.accessToken).toBe('access-token');
      expect(result.data.refreshToken).toBe('refresh-token');
      expect(result.data.user).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const dto = {
        email: 'nonexistent@example.com',
        password: 'SecurePass@123',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);

      await expect(service.login(dto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'WrongPassword@123',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(usersService, 'isAccountLocked').mockReturnValueOnce(false);
      jest.spyOn(usersService, 'verifyPassword').mockResolvedValueOnce(false);
      jest
        .spyOn(usersService, 'handleFailedLogin')
        .mockResolvedValueOnce(mockUser);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if email not verified', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'SecurePass@123',
      };

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(mockUserUnverified);
      jest.spyOn(usersService, 'isAccountLocked').mockReturnValueOnce(false);
      jest.spyOn(usersService, 'verifyPassword').mockResolvedValueOnce(true);

      await expect(service.login(dto)).rejects.toThrow('Email not verified');
    });

    it('should throw UnauthorizedException if account is locked', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'SecurePass@123',
      };

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(mockUserLocked);
      jest.spyOn(usersService, 'isAccountLocked').mockReturnValueOnce(true);

      await expect(service.login(dto)).rejects.toThrow('Account locked');
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token with rotation', async () => {
      const dto = {
        refreshToken: 'valid-refresh-token',
      };

      const payload = {
        sub: mockUser.id,
        type: 'refresh' as const,
      };

      jest
        .spyOn(tokenService, 'verifyRefreshToken')
        .mockReturnValueOnce(payload as any);
      jest.spyOn(usersService, 'findById').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(authRepository, 'findUserRefreshTokens')
        .mockResolvedValueOnce([{ id: 'token-1', tokenHash: 'hash' } as any]);
      jest
        .spyOn(tokenService, 'compareRefreshTokens')
        .mockResolvedValueOnce(true);
      jest
        .spyOn(tokenService, 'generateAccessToken')
        .mockReturnValueOnce('new-access-token');
      jest
        .spyOn(tokenService, 'generateRefreshToken')
        .mockReturnValueOnce('new-refresh-token');
      jest
        .spyOn(tokenService, 'hashRefreshToken')
        .mockResolvedValueOnce('new-hash');
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(undefined);

      const result = await service.refreshToken(dto);

      expect(result.success).toBe(true);
      expect(result.data.accessToken).toBe('new-access-token');
      expect(result.data.refreshToken).toBe('new-refresh-token');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const dto = {
        refreshToken: 'invalid-token',
      };

      jest
        .spyOn(tokenService, 'verifyRefreshToken')
        .mockImplementationOnce(() => {
          throw new Error('Invalid token');
        });

      await expect(service.refreshToken(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send reset email for existing account', async () => {
      const dto = {
        email: 'test@example.com',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(otpService, 'createOtp').mockResolvedValueOnce('123456');
      jest
        .spyOn(emailService, 'sendResetPasswordEmail')
        .mockResolvedValueOnce(true);

      const result = await service.forgotPassword(dto);

      expect(result.success).toBe(true);
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalled();
    });

    it('should return generic response for non-existent email', async () => {
      const dto = {
        email: 'nonexistent@example.com',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);

      const result = await service.forgotPassword(dto);

      expect(result.success).toBe(true);
      expect(result.message).toContain('If an account exists');
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      const dto = {
        email: 'test@example.com',
        resetToken: 'valid-reset-token',
        password: 'NewSecurePass@456',
        confirmPassword: 'NewSecurePass@456',
      };

      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        type: 'reset' as const,
      };

      jest
        .spyOn(tokenService, 'verifyResetToken')
        .mockReturnValueOnce(payload as any);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(undefined);

      const result = await service.resetPassword(dto);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Password reset successful');
    });

    it('should throw UnauthorizedException for invalid reset token', async () => {
      const dto = {
        email: 'test@example.com',
        resetToken: 'invalid-token',
        password: 'NewSecurePass@456',
        confirmPassword: 'NewSecurePass@456',
      };

      jest
        .spyOn(tokenService, 'verifyResetToken')
        .mockImplementationOnce(() => {
          throw new Error('Invalid token');
        });

      await expect(service.resetPassword(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException for mismatched passwords', async () => {
      const dto = {
        email: 'test@example.com',
        resetToken: 'valid-token',
        password: 'NewSecurePass@456',
        confirmPassword: 'DifferentPass@456',
      };

      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        type: 'reset' as const,
      };

      jest
        .spyOn(tokenService, 'verifyResetToken')
        .mockReturnValueOnce(payload as any);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(mockUser);

      await expect(service.resetPassword(dto)).rejects.toThrow(
        'Passwords do not match',
      );
    });
  });
});
