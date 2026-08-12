import { Injectable, NotFoundException } from '@nestjs/common';
import { EmploymentType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
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

    return this.prisma.experience.findMany({
      where: { profileId: profile.id },
    });
  }

  /**
   *
   * @param userId
   * @param experienceId
   * @returns
   */
  async findOne(userId: string, experienceId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.experience.findFirst({
      where: { profileId: profile.id, id: experienceId },
    });
  }

  /**
   *
   * @param userId
   * @param experienceId
   * @param dto
   * @returns
   */
  async update(userId: string, experienceId: string, dto: UpdateExperienceDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const experience = await this.prisma.experience.findFirst({
      where: { profileId: profile.id, id: experienceId },
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

  /**
   *
   * @param userId
   * @param experienceId
   * @returns
   */
  async remove(userId: string, experienceId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const experience = await this.prisma.experience.findFirst({
      where: { profileId: profile.id, id: experienceId },
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
