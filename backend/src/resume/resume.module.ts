import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
