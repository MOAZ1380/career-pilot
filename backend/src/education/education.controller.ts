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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtAccessPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('education')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(
    @CurrentUser() user: JwtAccessPayload,
    @Body() dto: CreateEducationDto,
  ) {
    return this.educationService.create(user.sub, dto);
  }

  @Get()
  findMe(@CurrentUser() user: JwtAccessPayload) {
    return this.educationService.findMe(user.sub);
  }

  @Patch()
  update(
    @CurrentUser() user: JwtAccessPayload,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationService.update(user.sub, dto);
  }

  @Delete()
  remove(@CurrentUser() user: JwtAccessPayload) {
    return this.educationService.remove(user.sub);
  }
}
