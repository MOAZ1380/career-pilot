import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateEducationDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.education.create({
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

    return this.prisma.education.findMany({
      where: { profileId: profile.id },
    });
  }

  async update(userId: string, dto: UpdateEducationDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const education = await this.prisma.education.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return this.prisma.education.update({
      where: { id: education.id },
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

    const education = await this.prisma.education.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return this.prisma.education.delete({
      where: { id: education.id },
    });
  }
}
