import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfileModule } from '../profile/profile.module';
import { ResumeModule } from '../resume/resume.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, ProfileModule, ResumeModule, AiModule],
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
