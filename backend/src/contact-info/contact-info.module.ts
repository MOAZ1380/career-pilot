import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContactInfoController } from './contact-info.controller';
import { ContactInfoService } from './contact-info.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContactInfoController],
  providers: [ContactInfoService],
})
export class ContactInfoModule {}
