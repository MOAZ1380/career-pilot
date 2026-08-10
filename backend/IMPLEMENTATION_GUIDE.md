# Authentication Implementation Guide

## Complete Setup Instructions

This guide walks through setting up and deploying the complete authentication system.

---

## Prerequisites

Ensure you have:

- Node.js 18+ installed
- PostgreSQL 12+ running
- Nodemailer-compatible SMTP service (Gmail, SendGrid, etc.)
- Git

---

## Step 1: Install Dependencies

```bash
cd backend
npm install

# Also install authentication-related dependencies if not already installed:
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install --save-dev @types/passport-jwt @types/bcrypt
npm install @nestjs/config @nestjs/throttler
npm install nodemailer
npm install --save-dev @types/nodemailer
npm install class-validator class-transformer
```

---

## Step 2: Environment Configuration

### Create `.env` file from `.env.example`

```bash
cp .env.example .env
```

### Generate Secure Secrets

Generate three separate 32-byte secrets for JWT:

```bash
# Linux/macOS
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Update `.env`

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/careerpilot

# JWT Secrets (use generated values)
JWT_ACCESS_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
JWT_RESET_SECRET=<generated-secret-3>

# SMTP (example with Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=noreply@careerpilot.com
SMTP_SECURE=false
```

**Note on Gmail SMTP:**

1. Enable 2-factor authentication
2. Generate app-specific password at: https://myaccount.google.com/apppasswords
3. Use that password in `SMTP_PASSWORD`

---

## Step 3: Database Setup

### Run Prisma Migrations

```bash
# Create and run migration
npx prisma migrate dev --name add_authentication

# Generate Prisma client
npx prisma generate
```

### Verify Schema

```bash
# Open Prisma Studio to verify models
npx prisma studio
```

Check these models exist:

- `User` (with auth fields)
- `RefreshToken`
- `Otp`

---

## Step 4: Test SMTP Configuration (Optional)

Create a quick test file:

```typescript
// test-smtp.ts
import { EmailService } from './src/email/email.service';
import { ConfigService } from '@nestjs/config';

async function testSmtp() {
  const configService = new ConfigService();
  const emailService = new EmailService(configService);

  const isValid = await emailService.verifySmtpConnection();
  console.log('SMTP Connection Valid:', isValid);
}

testSmtp();
```

Run: `npx ts-node test-smtp.ts`

---

## Step 5: Application Startup

### Development

```bash
npm run start:dev
```

Server runs on `http://localhost:3000`

### Production

```bash
npm run build
npm start
```

---

## Step 6: Verify Installation

### Test Register Endpoint

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass@123",
    "confirmPassword": "TestPass@123"
  }'
```

Expected response: `201 Created` with success message

### Check Database

```bash
npx prisma studio
```

Should see:

- New `User` record (isVerified: false)
- New `Otp` record (purpose: EMAIL_VERIFICATION)

### Check Email (if SMTP configured)

Should receive verification email with OTP

---

## Step 7: Workflow Testing

### 1. Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "moaz",
    "email": "moaz@example.com",
    "password": "Moaz@Password123",
    "confirmPassword": "Moaz@Password123"
  }'
```

### 2. Resend OTP (Get the code from database or email)

```bash
curl -X POST http://localhost:3000/auth/resend-verification-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com"
  }'
```

### 3. Verify Email

```bash
# Get OTP from database or email
# Run: npx prisma studio -> Otp table -> find codeHash
# OTP is 6 digits - try: 000000, 111111, etc. or check logs if not in production

curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "otp": "123456"
  }'
```

### 4. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moaz@example.com",
    "password": "Moaz@Password123"
  }'
```

Response contains `accessToken` and `refreshToken`

### 5. Get Current User

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN_FROM_LOGIN>"
```

---

## Database Cleanup (Development)

If you need to reset:

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or manually delete test data
npx prisma studio
# Delete all records manually
```

---

## Troubleshooting

### "JWT_ACCESS_SECRET not found"

**Solution:** Verify `.env` file exists and contains all required secrets

```bash
cat .env | grep JWT_
```

### "PrismaClientRustPanicError"

**Solution:** Regenerate Prisma client

```bash
npx prisma generate
```

### "Email not sending"

**Solutions:**

1. Verify SMTP credentials in `.env`
2. Check email service is not blocking app
3. Test SMTP separately
4. For Gmail: verify app-specific password

```bash
# Test Gmail SMTP
echo "From: test@gmail.com
To: recipient@example.com
Subject: Test

Test message" | openssl s_client -connect smtp.gmail.com:587 -starttls smtp
```

### Database Connection Error

**Solution:** Verify PostgreSQL running and DATABASE_URL correct

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Rate Limit Always Triggered

**Solution:** Check throttler configuration in `app.module.ts`

```bash
# Increase limits for development
THROTTLE_LIMIT=1000
THROTTLE_TTL=3600000
```

---

## Production Deployment

### 1. Environment Variables

Use a secrets management system:

- AWS Secrets Manager
- HashiCorp Vault
- Heroku Config Vars
- Azure Key Vault

**Never commit `.env` to version control**

### 2. Database

Use managed PostgreSQL:

- AWS RDS
- Google Cloud SQL
- Azure Database
- Heroku Postgres

Ensure:

- Automated backups enabled
- SSL connection required
- Point-in-time recovery configured

### 3. SMTP

Use production email service:

- SendGrid
- AWS SES
- Mailgun
- Postmark

Configure:

- SPF records
- DKIM signing
- DMARC policy

### 4. Application Deployment

```bash
# Build
npm run build

# Start
NODE_ENV=production npm start

# Or use PM2 for process management
pm2 start dist/main.js --name "careerpilot-api"
```

### 5. Monitoring

Implement logging:

```bash
npm install winston
```

Monitor:

- Failed logins
- OTP attempts
- Token refresh rates
- Email delivery failures

### 6. Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Error details not exposed
- [ ] Logging configured
- [ ] API documentation secured
- [ ] Dependency updates scheduled
- [ ] Security headers configured

---

## Future Enhancements

### 1. Redis for Session Management

```bash
npm install redis @nestjs/cache-manager cache-manager-redis-store
```

Implement in `token.service.ts`:

- Cache valid tokens
- Faster logout-all
- Distributed session management

### 2. BullMQ for Email Queuing

```bash
npm install bull
```

Benefits:

- Email delivery reliability
- Automatic retries
- Rate limiting per email service
- Background processing

### 3. 2FA / MFA

Extend OTP model with:

- TOTP (Google Authenticator)
- SMS verification
- Backup codes

### 4. OAuth Integration

Add strategies for:

- Google OAuth
- GitHub OAuth
- Microsoft OAuth

```bash
npm install @nestjs/passport passport-google-oauth20 passport-github
```

### 5. Account Features

- Email change with verification
- Phone number verification
- Account deletion
- Session management UI
- Device management

---

## API Documentation

Swagger documentation is available at:

```bash
npm install @nestjs/swagger swagger-ui-express
```

Add to `main.ts`:

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('CareerPilot API')
  .setDescription('Resume builder authentication API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

Access at: `http://localhost:3000/api-docs`

---

## Performance Considerations

### Database Indexes

Already configured in Prisma schema:

- `User.email`
- `User.username`
- `RefreshToken.userId`
- `Otp.userId`

Monitor slow queries:

```bash
# PostgreSQL query logging
# In .env:
# DATABASE_URL=postgresql://...?log_statement=all
```

### Rate Limiting

Current limits (configurable):

- Register: 5/hour/IP
- Login: 10/hour/IP
- OTP verification: 10/hour/user
- Token refresh: 30/hour/user

Adjust based on usage patterns

### Bcrypt Configuration

Current: `BCRYPT_SALT_ROUNDS=12`

Trade-offs:

- 10-11: Faster, acceptable for modern hardware
- 12: Balanced (recommended)
- 13-14: Slower, maximum security

---

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Load Testing

```bash
npm install -g artillery

# Create load-test.yml
targets:
  - http://localhost:3000

scenarios:
  - name: "Register users"
    flow:
      - post:
          url: "/auth/register"
          json:
            username: "{{ $randomString(8) }}"
            email: "{{ $randomString(8) }}@example.com"
            password: "TestPass@123"
            confirmPassword: "TestPass@123"

# Run
artillery run load-test.yml
```

---

## Support & Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport.js](http://www.passportjs.org)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## Support

For issues or questions:

1. Check logs: `npm run start:dev | grep -i error`
2. Run tests: `npm run test`
3. Check Prisma schema: `npx prisma studio`
4. Review API examples: See `API_EXAMPLES.md`
