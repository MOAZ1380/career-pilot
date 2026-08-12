import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async create(userId: string, dto: CreateProfileDto) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new NotFoundException('Profile already exists');
    }

    return this.prisma.profile.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  /**
   *
   * @param userId
   * @returns
   */
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

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async update(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...dto,
      },
    });
  }

  /**
   *
   * @param userId
   * @returns
   */
  async remove(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.delete({
      where: { userId },
    });
  }
}
