import { Injectable, NotFoundException } from '@nestjs/common';
import { SkillLevel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async create(userId: string, dto: CreateSkillDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.skill.create({
      data: {
        ...dto,
        level: dto.level as SkillLevel,
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

    return this.prisma.skill.findMany({
      where: { profileId: profile.id },
    });
  }

  async findOne(userId: string, skillId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const skill = await this.prisma.skill.findFirst({
      where: { profileId: profile.id, id: skillId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async update(userId: string, skillId: string, dto: UpdateSkillDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const skill = await this.prisma.skill.findFirst({
      where: { profileId: profile.id, id: skillId },
      select: { id: true },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return this.prisma.skill.update({
      where: { id: skill.id },
      data: dto,
    });
  }

  /**
   *
   * @param userId
   * @returns
   */
  async remove(userId: string, skillId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const skill = await this.prisma.skill.findFirst({
      where: { profileId: profile.id, id: skillId },
      select: { id: true },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return this.prisma.skill.delete({
      where: { id: skill.id },
    });
  }
}
