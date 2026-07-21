import { Injectable, NotFoundException } from '@nestjs/common';
import { EmploymentType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateExperienceDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.experience.create({
      data: {
        ...dto,
        employmentType: dto.employmentType as EmploymentType,
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

    return this.prisma.experience.findMany({
      where: { profileId: profile.id },
    });
  }

  async update(userId: string, dto: UpdateExperienceDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const experience = await this.prisma.experience.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return this.prisma.experience.update({
      where: { id: experience.id },
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

    const experience = await this.prisma.experience.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return this.prisma.experience.delete({
      where: { id: experience.id },
    });
  }
}
