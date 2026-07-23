import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
    return this.resumeService.findAll(this.userId);
  }

  @Get('/:resumeId')
  findOne(@Param('resumeId') resumeId: string) {
    return this.resumeService.findOne(this.userId, resumeId);
  }

  @Patch('/:resumeId')
  update(@Param('resumeId') resumeId: string, @Body() dto: UpdateResumeDto) {
    return this.resumeService.update(this.userId, resumeId, dto);
  }

  @Delete('/:resumeId')
  remove(@Param('resumeId') resumeId: string) {
    return this.resumeService.remove(this.userId, resumeId);
  }
}
