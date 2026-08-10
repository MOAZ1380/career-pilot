import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * OtpModule provides OTP services
 * Handles OTP generation, verification, and storage
 */
@Module({
  imports: [PrismaModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
