import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';

@Module({
  imports: [PrismaModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
