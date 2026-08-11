import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationService } from './education.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('education')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(user.sub, dto);
  }

  @Get()
  findMe() {
    return this.educationService.findMe(user.sub);
  }

  @Patch()
  update(@Body() dto: UpdateEducationDto) {
    return this.educationService.update(user.sub, dto);
  }

  @Delete()
  remove() {
    return this.educationService.remove(user.sub);
  }
}
