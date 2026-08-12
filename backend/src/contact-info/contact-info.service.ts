import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';

@Injectable()
export class ContactInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateContactInfoDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.contactInfo.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async findMe(userId: string) {
    const contactInfo = await this.prisma.contactInfo.findFirst({
      where: {
        profile: { userId },
      },
    });

    if (!contactInfo) {
      throw new NotFoundException('Contact info not found');
    }

    return contactInfo;
  }

  async update(
    userId: string,
    contactInfoId: string,
    dto: UpdateContactInfoDto,
  ) {
    const contactInfo = await this.prisma.contactInfo.findFirst({
      where: {
        profile: { userId },
        id: contactInfoId,
      },
      select: { id: true },
    });

    if (!contactInfo) {
      throw new NotFoundException('Contact info not found');
    }

    return this.prisma.contactInfo.update({
      where: { id: contactInfo.id },
      data: dto,
    });
  }

  async remove(userId: string, contactInfoId: string) {
    const contactInfo = await this.prisma.contactInfo.findFirst({
      where: {
        profile: { userId },
        id: contactInfoId,
      },
      select: { id: true },
    });

    if (!contactInfo) {
      throw new NotFoundException('Contact info not found');
    }

    return this.prisma.contactInfo.delete({
      where: { id: contactInfo.id },
    });
  }
}
