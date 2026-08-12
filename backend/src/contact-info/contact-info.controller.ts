import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtAccessPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('contact-info')
@UseGuards(JwtAuthGuard)
export class ContactInfoController {
  constructor(private readonly contactInfoService: ContactInfoService) {}

  // Temporary until JWT is added

  @Post()
  create(
    @CurrentUser() user: JwtAccessPayload,
    @Body() dto: CreateContactInfoDto,
  ) {
    return this.contactInfoService.create(user.sub, dto);
  }

  @Get()
  findMe(@CurrentUser() user: JwtAccessPayload) {
    return this.contactInfoService.findMe(user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtAccessPayload,
    @Param('id') contactInfoId: string,
    @Body() dto: UpdateContactInfoDto,
  ) {
    return this.contactInfoService.update(user.sub, contactInfoId, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: JwtAccessPayload,
    @Param('id') contactInfoId: string,
  ) {
    return this.contactInfoService.remove(user.sub, contactInfoId);
  }
}
