import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.project.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async findMe(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.project.findMany({
      where: { profileId: profile.id },
    });
  }

  async update(userId: string, dto: UpdateProjectDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const project = await this.prisma.project.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id: project.id },
      data: dto,
    });
  }

  async remove(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const project = await this.prisma.project.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.delete({
      where: { id: project.id },
    });
  }
}
