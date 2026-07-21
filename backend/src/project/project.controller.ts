import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.projectService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateProjectDto) {
    return this.projectService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.projectService.remove(this.userId);
  }
}
