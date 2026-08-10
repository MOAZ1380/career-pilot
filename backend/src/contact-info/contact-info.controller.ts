import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('contact-info')
@UseGuards(JwtAuthGuard)
export class ContactInfoController {
  constructor(private readonly contactInfoService: ContactInfoService) {}

  // Temporary until JWT is added
  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateContactInfoDto) {
    return this.contactInfoService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.contactInfoService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateContactInfoDto) {
    return this.contactInfoService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.contactInfoService.remove(this.userId);
  }
}
