# CareerPilot Authentication System Architecture

## Overview

This document defines the complete authentication system for CareerPilot, a production-ready Resume Builder platform.

### Core Principles
- **Clean Architecture**: Separation of concerns with clear layer boundaries
- **Security First**: No sensitive data leakage; secure by default
- **Scalability**: Support for future features (OAuth, 2FA, MFA, Redis sessions)
- **Maintainability**: SOLID principles, DI, modular NestJS architecture
- **Performance**: Efficient database queries, proper indexing, horizontal scalability

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HTTP Layer (Controllers)                     │
│                    AuthController with route handlers                │
└──────────────────┬────────────────────────────────────────────────┘
                   │
          ┌────────▼────────┐
          │ Guards & Pipes  │
          │ Validation      │
          │ Rate Limiting   │
          └────────┬────────┘
                   │
┌──────────────────▼────────────────────────────────────────────────┐
│                     Business Logic Layer (Services)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  AuthService │  │ TokenService │  │  OtpService  │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│  ┌──────────────┐  ┌──────────────┐                               │
│  │ EmailService │  │ UsersService │                               │
│  └──────────────┘  └──────────────┘                               │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────────┐
│                   Data Access Layer (Repositories)                │
│         AuthRepository & UsersRepository with Prisma              │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────────────────┐
│                    ORM Layer (Prisma)                             │
│            Database models & transactions                          │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
            PostgreSQL Database
```

---

## Folder Structure

```
src/
├── auth/                          # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.repository.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── verify-email.dto.ts
│   │   ├── resend-verification-otp.dto.ts
│   │   ├── login.dto.ts
│   │   ├── refresh-token.dto.ts
│   │   ├── forgot-password.dto.ts
│   │   ├── verify-reset-otp.dto.ts
│   │   ├── reset-password.dto.ts
│   │   ├── logout.dto.ts
│   │   └── current-user.dto.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   └── interfaces/
│       └── jwt-payload.interface.ts
│
├── email/                         # Email module
│   ├── email.module.ts
│   ├── email.service.ts
│   └── templates/
│       ├── verification-email.template.ts
│       └── reset-password-email.template.ts
│
├── users/                         # Users module
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.repository.ts
│
├── common/                        # Shared utilities & infrastructure
│   ├── filters/
│   │   └── global-exception.filter.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   └── utils/
│       ├── password.util.ts
│       ├── otp.util.ts
│       └── validators/
│           └── match-passwords.validator.ts
│
├── config/                        # Configuration
│   ├── config.ts
│   └── validation.ts
│
├── token/                         # Token service (optional separate module)
│   ├── token.module.ts
│   └── token.service.ts
│
├── otp/                           # OTP service (optional separate module)
│   ├── otp.module.ts
│   └── otp.service.ts
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── app.module.ts
└── main.ts
```

---

## Data Model (Prisma)

### User Model
```prisma
model User {
  id                    String   @id @default(uuid())
  username              String   @unique
  email                 String   @unique
  passwordHash          String
  isVerified            Boolean  @default(false)
  lastLoginAt           DateTime?
  failedLoginAttempts   Int      @default(0)
  lockedUntil           DateTime?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  refreshTokens         RefreshToken[]
  otps                  Otp[]
  
  @@index([email])
  @@index([username])
  @@index([lockedUntil])
}
```

### RefreshToken Model
```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  tokenHash String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([expiresAt])
}
```

### OTP Model
```prisma
enum OtpPurpose {
  EMAIL_VERIFICATION
  PASSWORD_RESET
}

model Otp {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  codeHash  String
  purpose   OtpPurpose
  expiresAt DateTime
  attempts  Int         @default(0)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  @@index([userId])
  @@index([purpose])
  @@index([expiresAt])
}
```

---

## Service Responsibilities

### AuthService
- **Register**: Validate, create user, generate OTP
- **Verify Email**: Validate OTP, mark user as verified
- **Resend OTP**: Rate limit, generate new OTP
- **Login**: Validate credentials, generate tokens
- **Refresh Token**: Rotate refresh token securely
- **Logout**: Invalidate single refresh token
- **Logout All**: Invalidate all refresh tokens
- **Forgot Password**: Generate password reset OTP
- **Verify Reset OTP**: Validate OTP, issue reset token
- **Reset Password**: Validate reset token, update password
- **Get Current User**: Return sanitized user data

### TokenService
- Generate access token (JWT, 15 minutes)
- Generate refresh token (JWT, 7 days)
- Verify tokens
- Hash refresh tokens (bcrypt)
- Compare token hashes
- Extract JWT payload

### OtpService
- Generate secure 6-digit OTP
- Hash OTP (bcrypt)
- Verify OTP
- Check expiration (10 minutes)
- Track attempts (max 5)
- Invalidate OTP
- Check resend cooldown (60 seconds)

### EmailService
- Send verification email
- Send password reset email
- Use HTML templates
- Handle SMTP errors
- No logging of OTP values

### UsersService
- Find user by ID, email, username
- Create user
- Update verification status
- Update password
- Update failed login attempts
- Lock/unlock account
- Return sanitized user data

---

## Authentication Flows

### Registration Flow
```
1. User submits register form
   ├─ Validate DTO
   ├─ Normalize email (trim, lowercase)
   ├─ Check username uniqueness
   ├─ Check email uniqueness
   ├─ Validate password strength
   ├─ Hash password
   ├─ Start DB transaction
   │  ├─ Create user (isVerified = false)
   │  └─ Create OTP (EMAIL_VERIFICATION, 10 min expiration)
   ├─ Commit transaction
   └─ Send verification email (outside transaction)
2. Server responds with success (no token yet)
3. User receives email with OTP
```

### Email Verification Flow
```
1. User submits OTP
   ├─ Normalize email
   ├─ Validate OTP format
   ├─ Find user
   ├─ Check if already verified
   ├─ Find active EMAIL_VERIFICATION OTP
   ├─ Check expiration
   ├─ Check attempts < 5
   ├─ Compare hashed OTP
   └─ If invalid: increment attempts, check if > 5 (invalidate OTP)
   ├─ Start DB transaction
   │  ├─ Mark user as verified
   │  └─ Invalidate OTP
   └─ Commit transaction
2. Server responds with success
3. User can now login
```

### Login Flow
```
1. User submits credentials
   ├─ Normalize email
   ├─ Find user
   ├─ Check if locked (lockedUntil > now)
   ├─ Compare password
   ├─ Check isVerified
   └─ If invalid: increment failedLoginAttempts, lock if >= 5
   ├─ Reset failedLoginAttempts
   ├─ Generate access token (15 min)
   ├─ Generate refresh token (7 days)
   ├─ Hash refresh token
   ├─ Start DB transaction
   │  ├─ Store hashed refresh token
   │  └─ Update lastLoginAt
   └─ Commit transaction
2. Server responds with tokens + user data (no hashes returned)
```

### Refresh Token Flow
```
1. Client submits refresh token
   ├─ Verify refresh JWT
   ├─ Extract userId from payload
   ├─ Find refresh token record
   ├─ Compare supplied token against hash
   ├─ Check expiration
   ├─ Generate new access token (15 min)
   ├─ Generate new refresh token (7 days)
   ├─ Hash new refresh token
   ├─ Start DB transaction
   │  ├─ Delete old refresh token
   │  └─ Create new refresh token record
   └─ Commit transaction
2. Server responds with new tokens (rotation complete)
3. Old token is no longer valid
```

### Password Reset Flow
```
Stage 1 - Forgot Password:
1. User submits email
   ├─ Normalize email
   ├─ Find user (don't reveal if not found)
   ├─ Generate PASSWORD_RESET OTP (10 min)
   ├─ Hash OTP
   ├─ Start DB transaction
   │  ├─ Invalidate previous PASSWORD_RESET OTPs
   │  └─ Store new OTP
   └─ Commit transaction
   └─ Send reset email (outside transaction)
2. Server responds: "If account exists, reset email sent"

Stage 2 - Verify Reset OTP:
1. User submits email + OTP
   ├─ Normalize email
   ├─ Find PASSWORD_RESET OTP
   ├─ Check expiration
   ├─ Check attempts < 5
   ├─ Compare hashed OTP
   └─ If invalid: increment attempts
   ├─ Start DB transaction
   │  └─ Invalidate OTP
   └─ Commit transaction
   ├─ Generate short-lived reset token (15 min)
2. Server responds with resetToken

Stage 3 - Reset Password:
1. User submits email + resetToken + new password
   ├─ Normalize email
   ├─ Verify reset JWT
   ├─ Validate password strength
   ├─ Confirm passwords match
   ├─ Hash new password
   ├─ Start DB transaction
   │  ├─ Find user
   │  ├─ Update password
   │  └─ Invalidate all refresh tokens (logout all)
   └─ Commit transaction
2. Server responds: success
3. User must login again
```

---

## Security Decisions

### 1. Password Security
- Use bcrypt with salt rounds = 12
- Never store plaintext passwords
- Password policy: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Never return passwordHash in responses

### 2. Token Management
- **Access Token**: Short-lived (15 minutes), in Authorization header or memory
- **Refresh Token**: Long-lived (7 days), hashed in database, rotated on use
- Separate secrets for access and refresh tokens
- Different expiration times prevent token confusion
- Refresh token rotation prevents token reuse attacks

### 3. OTP Security
- Cryptographically secure 6-digit OTP (not just random)
- Hashed with bcrypt before storage
- 10-minute expiration
- Maximum 5 attempts
- 60-second resend cooldown
- Invalidated after successful use
- Purpose-specific (EMAIL_VERIFICATION vs PASSWORD_RESET)

### 4. Account Lockout
- Lock after 5 failed login attempts
- Lock duration: 15 minutes
- Reset failed attempts after successful login
- Prevents brute force attacks

### 5. Email Enumeration Prevention
- Forgot-password endpoint doesn't reveal if email exists
- Same generic response for both found and not-found cases
- Resend-OTP also uses generic response
- Prevents attackers from finding valid emails

### 6. Refresh Token Storage
- Never store plaintext refresh tokens
- Only store bcrypt hashes
- One-to-many relationship (User has many RefreshTokens)
- Allows multiple devices and logout-all functionality
- Tokens are compared as: bcrypt.compare(suppliedToken, storedHash)

### 7. Database Transactions
- User creation + OTP creation are transactional
- Password reset invalidates all sessions atomically
- Email sending happens OUTSIDE transactions
- If email fails, user is already created (allows resend)

### 8. Cookie vs Header Strategy
- **Refresh Token**: HttpOnly cookie (secure, not accessible to JS, survives tab close)
  - Secure: true (HTTPS only)
  - SameSite: Strict (CSRF protection)
  - Domain/Path: configured appropriately
- **Access Token**: Memory or localStorage (frontend convenience)
  - Can implement cookie option too (trade-off: CSRF exposure)
- Rationale: Refresh token is sensitive and long-lived; access token is short-lived

### 9. Rate Limiting
- Register: 5 per hour per IP
- Login: 10 per hour per IP (stricter after failed attempts)
- Verify-email: 10 per hour per user
- Resend OTP: 5 per hour per user
- Forgot-password: 5 per hour per email
- Verify-reset-OTP: 10 per hour per email
- Refresh: 30 per hour per user (multiple devices)

### 10. Sensitive Data Leakage Prevention
- Never return passwordHash in any response
- Never return refresh token hash
- Never return OTP or OTP hash
- Never return reset token
- Never log passwords, OTPs, or tokens
- Never expose raw Prisma errors
- Always use generic error messages when appropriate

---

## Module Dependencies

```
AuthModule
├── imports: [UsersModule, TokenModule, OtpModule, EmailModule, JwtModule, PassportModule]
└── controllers: [AuthController]
└── services: [AuthService, AuthRepository]

TokenModule
├── services: [TokenService]
├── imports: [JwtModule]
└── exports: [TokenService]

OtpModule
├── services: [OtpService]
└── exports: [OtpService]

EmailModule
├── services: [EmailService]
└── exports: [EmailService]

UsersModule
├── imports: [PrismaModule]
├── services: [UsersService, UsersRepository]
└── exports: [UsersService]

PrismaModule (global)
├── services: [PrismaService]
└── exports: [PrismaService]

AppModule
└── imports: [ConfigModule, PrismaModule, AuthModule, UsersModule, TokenModule, OtpModule, EmailModule]
```

---

## HTTP Status Codes

| Status | Endpoint | Reason |
|--------|----------|--------|
| 201 | POST /auth/register | User created |
| 200 | POST /auth/verify-email | Verification successful |
| 200 | POST /auth/resend-verification-otp | OTP sent |
| 200 | POST /auth/login | Login successful |
| 200 | POST /auth/refresh | Token refreshed |
| 200 | POST /auth/logout | Logout successful |
| 200 | POST /auth/logout-all | All devices logged out |
| 200 | POST /auth/forgot-password | Reset email sent (or generic) |
| 200 | POST /auth/verify-reset-otp | OTP verified |
| 200 | POST /auth/reset-password | Password reset successful |
| 200 | GET /auth/me | User data retrieved |
| 400 | Any endpoint | Validation error |
| 401 | Login/Refresh/JWT | Unauthorized |
| 403 | Login (unverified) | Forbidden |
| 409 | Register | Duplicate email/username |
| 429 | Any endpoint | Rate limit exceeded |

---

## JWT Payload Structure

### Access Token
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "type": "access",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Refresh Token
```json
{
  "sub": "user-id",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Reset Token
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "type": "reset",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Environment Variables

```
# Database
DATABASE_URL=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_RESET_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_RESET_EXPIRES_IN=15m

# SMTP
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@careerpilot.com
SMTP_SECURE=false

# Rate Limiting
THROTTLE_TTL=3600
THROTTLE_LIMIT=100

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Application
NODE_ENV=production
APP_URL=https://careerpilot.com
```

---

## Future Scalability

### Redis Integration
- Cache user sessions
- Cache OTP validation attempts
- Distributed rate limiting
- Session management across servers

### BullMQ Integration
- Queue email sending
- Retry failed emails
- Background job processing
- Scheduled OTP cleanup

### OAuth Integration
- Google OAuth
- GitHub OAuth
- Microsoft OAuth
- Existing structure supports adding strategies

### 2FA/MFA
- TOTP-based 2FA
- SMS-based 2FA
- Backup codes
- Trust device option

### Other Features
- Email change verification
- Phone verification
- Account deletion
- Session management UI
- Device management

---

## Testing Strategy

All services have corresponding `.spec.ts` test files with:
- Unit tests for core business logic
- Mock dependencies
- Test fixtures
- Error scenarios
- Edge cases

---

## Summary

This authentication system provides:
✓ Secure password handling
✓ Multi-step email verification
✓ Secure OTP workflow
✓ Refresh token rotation
✓ Password reset with OTP
✓ Account lockout protection
✓ Rate limiting
✓ Email enumeration prevention
✓ Clean architecture
✓ Production-ready error handling
✓ Scalability foundation
