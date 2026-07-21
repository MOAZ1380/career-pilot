import { Injectable, NotFoundException } from '@nestjs/common';
import { SkillLevel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findMe(userId: string) {
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

  async update(userId: string, dto: UpdateSkillDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const skill = await this.prisma.skill.findFirst({
      where: { profileId: profile.id },
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

  async remove(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const skill = await this.prisma.skill.findFirst({
      where: { profileId: profile.id },
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
