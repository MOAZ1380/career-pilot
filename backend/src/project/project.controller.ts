import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtAccessPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@CurrentUser() user: JwtAccessPayload, @Body() dto: CreateProjectDto) {
    return this.projectService.create(user.sub, dto);
  }

  @Get()
  findMe(@CurrentUser() user: JwtAccessPayload) {
    return this.projectService.findMe(user.sub);
  }

  @Patch()
  update(@CurrentUser() user: JwtAccessPayload, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(user.sub, dto);
  }

  @Delete()
  remove(@CurrentUser() user: JwtAccessPayload) {
    return this.projectService.remove(user.sub);
  }
}
