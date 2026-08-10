# Authentication API Examples

This document provides complete curl examples for testing all authentication endpoints.

## Base URL

```
http://localhost:3000/auth
```

## Standard Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "message": "Operation description",
  "data": {} // or null
}
```

---

## 1. Register

**Endpoint:** `POST /auth/register`  
**Authentication:** None  
**Rate Limit:** 5 per hour per IP  
**Response:** 201 Created

### Request

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "moaz",
    "email": "moaz@example.com",
    "password": "MySecurePass@123",
    "confirmPassword": "MySecurePass@123"
  }'
```

### Request Validation

```bash
# Missing required field
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "moaz",
    "email": "moaz@example.com"
  }'
# Response: 400 Bad Request
```

```bash
# Passwords don't match
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "moaz",
    "email": "moaz@example.com",
    "password": "MySecurePass@123",
    "confirmPassword": "DifferentPassword@123"
  }'
# Response: 400 Bad Request - "Passwords do not match"
```

```bash
# Weak password (no uppercase)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "moaz",
    "email": "moaz@example.com",
    "password": "myweakpass123",
    "confirmPassword": "myweakpass123"
  }'
# Response: 400 Bad Request - "Password must contain at least one uppercase letter"
```

### Success Response

```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": null
}
```

### Duplicate Email

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "moaz@example.com",
    "password": "MySecurePass@123",
    "confirmPassword": "MySecurePass@123"
  }'
# Response: 409 Conflict - "Email already registered"
```

### Duplicate Username

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "moaz",
    "email": "different@example.com",
    "password": "MySecurePass@123",
    "confirmPassword": "MySecurePass@123"
  }'
# Response: 409 Conflict - "Username already taken"
```

### Rate Limit

```bash
# After 5 requests in an hour
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user6",
    "email": "user6@example.com",
    "password": "MySecurePass@123",
    "confirmPassword": "MySecurePass@123"
  }'
# Response: 429 Too Many Requests
```

---

## 2. Verify Email

**Endpoint:** `POST /auth/verify-email`  
**Authentication:** None  
**Rate Limit:** 10 per hour per user  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "otp": "123456"
  }'
```

### Success Response

```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in.",
  "data": null
}
```

### Invalid OTP

```bash
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "otp": "999999"
  }'
# Response: 401 Unauthorized - "Invalid or expired OTP"
```

### OTP Attempt Limit

```bash
# After 5 failed attempts
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "otp": "000000"
  }'
# Response: 401 Unauthorized - "Invalid or expired OTP"
# Note: OTP is now invalidated after 5 attempts - must resend
```

### Already Verified

```bash
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verified@example.com",
    "otp": "123456"
  }'
# Response: 200 OK - "Email already verified"
```

---

## 3. Resend Verification OTP

**Endpoint:** `POST /auth/resend-verification-otp`  
**Authentication:** None  
**Rate Limit:** 5 per hour per user  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/resend-verification-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com"
  }'
```

### Success Response (Generic - doesn't reveal if email exists)

```json
{
  "success": true,
  "message": "If an account exists with this email, a verification code has been sent.",
  "data": null
}
```

### Rate Limit / Cooldown

```bash
# Trying to resend before 60 seconds pass
curl -X POST http://localhost:3000/auth/resend-verification-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com"
  }'
# Response: 400 Bad Request - "Please wait before requesting a new code..."
```

---

## 4. Login

**Endpoint:** `POST /auth/login`  
**Authentication:** None  
**Rate Limit:** 10 per hour per IP  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "password": "MySecurePass@123"
  }'
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "moaz",
      "email": "moaz@example.com",
      "isVerified": true,
      "createdAt": "2026-08-10T10:00:00Z",
      "updatedAt": "2026-08-10T10:30:00Z"
    }
  }
}
```

### Invalid Email

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "MySecurePass@123"
  }'
# Response: 401 Unauthorized - "Invalid email or password"
```

### Wrong Password

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "password": "WrongPassword@123"
  }'
# Response: 401 Unauthorized - "Invalid email or password"
# Note: failedLoginAttempts incremented
```

### Email Not Verified

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "unverified@example.com",
    "password": "MySecurePass@123"
  }'
# Response: 403 Forbidden - "Email not verified. Please verify your email first."
```

### Account Locked (After 5 failed attempts)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "password": "WrongPassword@123"
  }'
# Response: 401 Unauthorized - "Account locked. Try again in 15 minutes."
```

---

## 5. Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Authentication:** None  
**Rate Limit:** 30 per hour per user  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Success Response

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Invalid Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid-token-string"
  }'
# Response: 401 Unauthorized - "Invalid or expired refresh token"
```

### Expired Token

```bash
# Token older than 7 days
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
# Response: 401 Unauthorized - "Invalid or expired refresh token"
```

### Token Reuse (Compromised Token)

```bash
# If old token is used after rotation
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "old-rotated-token"
  }'
# Response: 401 Unauthorized - "Invalid refresh token"
# Note: Rotation means old token is deleted and cannot be reused
```

---

## 6. Logout

**Endpoint:** `POST /auth/logout`  
**Authentication:** Required (Bearer token)  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Success Response

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

### No Authentication

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
# Response: 401 Unauthorized
```

---

## 7. Logout All Devices

**Endpoint:** `POST /auth/logout-all`  
**Authentication:** Required (Bearer token)  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/logout-all \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Success Response

```json
{
  "success": true,
  "message": "Logged out from all devices",
  "data": null
}
```

---

## 8. Forgot Password

**Endpoint:** `POST /auth/forgot-password`  
**Authentication:** None  
**Rate Limit:** 5 per hour per email  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com"
  }'
```

### Success Response (Generic - doesn't reveal if email exists)

```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset code has been sent.",
  "data": null
}
```

### Non-existent Email (Same Response)

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com"
  }'
# Response: 200 OK
# Same message - doesn't reveal whether email exists (email enumeration prevention)
```

---

## 9. Verify Reset OTP

**Endpoint:** `POST /auth/verify-reset-otp`  
**Authentication:** None  
**Rate Limit:** 10 per hour per email  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/verify-reset-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "otp": "123456"
  }'
```

### Success Response

```json
{
  "success": true,
  "message": "Reset code verified",
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Invalid OTP

```bash
curl -X POST http://localhost:3000/auth/verify-reset-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "otp": "999999"
  }'
# Response: 401 Unauthorized - "Invalid or expired reset code"
```

---

## 10. Reset Password

**Endpoint:** `POST /auth/reset-password`  
**Authentication:** None  
**Rate Limit:** 5 per hour per email  
**Response:** 200 OK

### Request

```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "password": "NewSecurePass@456",
    "confirmPassword": "NewSecurePass@456"
  }'
```

### Success Response

```json
{
  "success": true,
  "message": "Password reset successful. Please log in with your new password.",
  "data": null
}
```

### Invalid Reset Token

```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "resetToken": "invalid-token",
    "password": "NewSecurePass@456",
    "confirmPassword": "NewSecurePass@456"
  }'
# Response: 401 Unauthorized - "Invalid or expired reset token"
```

### Expired Reset Token

```bash
# Token older than 15 minutes
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "password": "NewSecurePass@456",
    "confirmPassword": "NewSecurePass@456"
  }'
# Response: 401 Unauthorized - "Invalid or expired reset token"
```

### Weak Password

```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "password": "weakpass",
    "confirmPassword": "weakpass"
  }'
# Response: 400 Bad Request - "Password must be at least 8 characters long"
```

### Password Mismatch

```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "password": "NewSecurePass@456",
    "confirmPassword": "DifferentPass@456"
  }'
# Response: 400 Bad Request - "Passwords do not match"
```

---

## 11. Get Current User

**Endpoint:** `GET /auth/me`  
**Authentication:** Required (Bearer token)  
**Response:** 200 OK

### Request

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Success Response

```json
{
  "success": true,
  "message": "User data retrieved",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "moaz",
    "email": "moaz@example.com",
    "isVerified": true,
    "createdAt": "2026-08-10T10:00:00Z",
    "updatedAt": "2026-08-10T10:30:00Z"
  }
}
```

### Invalid Token

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer invalid-token"
# Response: 401 Unauthorized
```

### Missing Token

```bash
curl -X GET http://localhost:3000/auth/me
# Response: 401 Unauthorized
```

### Expired Token

```bash
# Token older than 15 minutes
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# Response: 401 Unauthorized
# Use refresh endpoint to get new access token
```

---

## Error Response Examples

### Validation Error

```json
{
  "success": false,
  "message": "Validation error",
  "error": "Bad Request",
  "statusCode": 400
}
```

### Unauthorized

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Forbidden

```json
{
  "success": false,
  "message": "Email not verified. Please verify your email first.",
  "error": "Forbidden",
  "statusCode": 403
}
```

### Conflict

```json
{
  "success": false,
  "message": "Email already registered",
  "error": "Conflict",
  "statusCode": 409
}
```

### Rate Limit

```json
{
  "success": false,
  "message": "Too Many Requests",
  "error": "Too Many Requests",
  "statusCode": 429
}
```

### Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "statusCode": 500
}
```
