import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateResumeDto) {
    return this.resumeService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.resumeService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateResumeDto) {
    return this.resumeService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.resumeService.remove(this.userId);
  }
}
