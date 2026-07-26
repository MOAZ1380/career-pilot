import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [ProfileModule, PrismaModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
