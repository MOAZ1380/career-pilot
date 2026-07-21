import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  imports: [PrismaModule],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
