import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageService } from './language.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtAccessPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('language')
@UseGuards(JwtAuthGuard)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  create(
    @CurrentUser() user: JwtAccessPayload,
    @Body() dto: CreateLanguageDto,
  ) {
    return this.languageService.create(user.sub, dto);
  }

  @Get()
  findMe(@CurrentUser() user: JwtAccessPayload) {
    return this.languageService.findMe(user.sub);
  }

  @Patch()
  update(
    @CurrentUser() user: JwtAccessPayload,
    @Body() dto: UpdateLanguageDto,
  ) {
    return this.languageService.update(user.sub, dto);
  }

  @Delete()
  remove(@CurrentUser() user: JwtAccessPayload) {
    return this.languageService.remove(user.sub);
  }
}
