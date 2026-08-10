import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceService } from './experience.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('experience')
@UseGuards(JwtAuthGuard)
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateExperienceDto) {
    return this.experienceService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.experienceService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateExperienceDto) {
    return this.experienceService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.experienceService.remove(this.userId);
  }
}
