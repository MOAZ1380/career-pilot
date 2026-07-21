import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProfileDto) {
    // if profile exist
    return this.prisma.profile.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findMe(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        contactInfo: true,
        skills: true,
        experiences: true,
        projects: true,
        educations: true,
        certificates: true,
        languages: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(userId: string, dto: UpdateProfileDto) {
    // if profile exist
    return this.prisma.profile.update({
      where: { userId },
      data: dto,
    });
  }

  async remove(userId: string) {
    // if profile exist
    return this.prisma.profile.delete({
      where: { userId },
    });
  }
}
