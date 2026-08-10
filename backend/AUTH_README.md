# CareerPilot Authentication System

A production-ready, secure authentication system for the CareerPilot resume builder.

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Create database
npx prisma migrate dev --name add_authentication

# Start development server
npm run start:dev
```

Server runs on `http://localhost:3000`

## Features

### 11 Authentication Endpoints

- **Register** - New user registration with email verification
- **Email Verification** - Verify email with OTP
- **Resend OTP** - Resend verification code
- **Login** - User authentication with account locking
- **Refresh Token** - Token refresh with rotation
- **Logout** - Single device logout
- **Logout All** - All devices logout
- **Forgot Password** - Password reset initiation
- **Verify Reset OTP** - Reset code verification
- **Reset Password** - Complete password reset
- **Get Current User** - Fetch authenticated user data

### Security Features

✅ Bcrypt password hashing (12 salt rounds)  
✅ JWT with separate access/refresh tokens  
✅ Refresh token rotation  
✅ OTP security (crypto generation, attempt limiting)  
✅ Account lockout protection  
✅ Email enumeration prevention  
✅ Rate limiting on all endpoints  
✅ Database transaction safety

### Built With

- NestJS 10+
- Passport.js (JWT)
- Prisma ORM
- PostgreSQL
- Nodemailer

## Documentation

### Key Documents

1. **[AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)** - Complete system design
2. **[API_EXAMPLES.md](./API_EXAMPLES.md)** - 200+ lines of curl examples
3. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Setup and deployment
4. **[AUTHENTICATION_SUMMARY.md](./AUTHENTICATION_SUMMARY.md)** - Project overview

### Test Example

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass@123",
    "confirmPassword": "TestPass@123"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass@123"
  }'
```

## Project Structure

```
src/
├── auth/              # Authentication endpoints & logic
├── users/             # User management
├── token/             # JWT token operations
├── otp/               # OTP generation & verification
├── email/             # Email sending
└── common/            # Shared utilities & infrastructure
```

## Environment Variables

Required:

```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_RESET_SECRET=...
```

Optional (for email):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
```

See `.env.example` for full details.

## API Response Format

All endpoints return consistent format:

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

## Rate Limiting

| Endpoint | Limit   |
| -------- | ------- |
| Register | 5/hour  |
| Login    | 10/hour |
| Refresh  | 30/hour |

## Testing

```bash
# Run unit tests
npm run test

# Run specific test
npm run test -- auth.service
```

## Deployment

For production deployment, see **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)**.

Production checklist:

- [ ] Environment variables set securely
- [ ] Database backups configured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Email service verified
- [ ] Error logging configured

## Support

For issues:

1. Check [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) Troubleshooting section
2. Review [API_EXAMPLES.md](./API_EXAMPLES.md) for endpoint details
3. Run tests: `npm run test`
4. Check database: `npx prisma studio`

## Future Enhancements

- [ ] Redis session caching
- [ ] Email queue (BullMQ)
- [ ] 2FA/MFA support
- [ ] OAuth integration
- [ ] Device management

## License

Part of CareerPilot project.

---

**Status**: ✅ Production Ready
