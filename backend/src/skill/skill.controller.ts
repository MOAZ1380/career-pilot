import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillService } from './skill.service';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.skillService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.skillService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateSkillDto) {
    return this.skillService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.skillService.remove(this.userId);
  }
}
