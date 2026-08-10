import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * EmailModule provides email services
 * Handles sending verification and password reset emails
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
