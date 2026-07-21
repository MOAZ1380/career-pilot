import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.educationService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateEducationDto) {
    return this.educationService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.educationService.remove(this.userId);
  }
}
