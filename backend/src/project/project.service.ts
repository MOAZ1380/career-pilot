import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
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

  /**
   *
   * @param userId
   * @returns
   */
  async findAll(userId: string) {
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

  /**
   *
   * @param userId
   * @param projectId
   * @returns
   */
  async findOne(userId: string, projectId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const project = await this.prisma.project.findFirst({
      where: { profileId: profile.id, id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const project = await this.prisma.project.findFirst({
      where: { profileId: profile.id, id: projectId },
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

  /**
   *
   * @param userId
   * @returns
   */
  async remove(userId: string, projectId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const project = await this.prisma.project.findFirst({
      where: { profileId: profile.id, id: projectId },
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
