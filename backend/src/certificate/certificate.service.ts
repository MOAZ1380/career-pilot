import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCertificateDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.certificate.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async findAll(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.certificate.findMany({
      where: { profileId: profile.id },
    });
  }

  async findOne(userId: string, certificateId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const certificate = await this.prisma.certificate.findFirst({
      where: { profileId: profile.id, id: certificateId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async update(
    userId: string,
    certificateId: string,
    dto: UpdateCertificateDto,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const certificate = await this.prisma.certificate.findFirst({
      where: { profileId: profile.id, id: certificateId },
      select: { id: true },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return this.prisma.certificate.update({
      where: { id: certificate.id },
      data: dto,
    });
  }

  async remove(userId: string, certificateId) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const certificate = await this.prisma.certificate.findFirst({
      where: { profileId: profile.id, id: certificateId },
      select: { id: true },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return this.prisma.certificate.delete({
      where: { id: certificate.id },
    });
  }
}
