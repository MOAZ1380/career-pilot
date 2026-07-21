import { Injectable, NotFoundException } from '@nestjs/common';
import { ResumeTemplate } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateResumeDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.resume.create({
      data: {
        ...dto,
        template: dto.template as ResumeTemplate,
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

    return this.prisma.resume.findMany({
      where: { profileId: profile.id },
    });
  }

  async update(userId: string, dto: UpdateResumeDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const resume = await this.prisma.resume.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.resume.update({
      where: { id: resume.id },
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

    const resume = await this.prisma.resume.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.resume.delete({
      where: { id: resume.id },
    });
  }
}
