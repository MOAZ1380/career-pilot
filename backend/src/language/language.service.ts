import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageLevel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async create(userId: string, dto: CreateLanguageDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.language.create({
      data: {
        ...dto,
        level: dto.level as LanguageLevel,
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

    return this.prisma.language.findMany({
      where: { profileId: profile.id },
    });
  }

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async update(userId: string, languageId: string, dto: UpdateLanguageDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const language = await this.prisma.language.findFirst({
      where: { profileId: profile.id, id: languageId },
      select: { id: true },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return this.prisma.language.update({
      where: { id: language.id },
      data: dto,
    });
  }

  /**
   *
   * @param userId
   * @param languageId
   * @returns
   */
  async findOne(userId: string, languageId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const language = await this.prisma.language.findFirst({
      where: { profileId: profile.id, id: languageId },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return language;
  }

  /**
   *
   * @param userId
   * @param languageId
   * @returns
   */
  async remove(userId: string, languageId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const language = await this.prisma.language.findFirst({
      where: { profileId: profile.id, id: languageId },
      select: { id: true },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return this.prisma.language.delete({
      where: { id: language.id },
    });
  }
}
