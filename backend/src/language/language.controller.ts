import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateLanguageDto) {
    return this.languageService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.languageService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateLanguageDto) {
    return this.languageService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.languageService.remove(this.userId);
  }
}
