import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResumeTemplate } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class ResumeService {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   *
   * @param userId
   * @param dto
   * @returns
   */
  async create(userId: string, dto: CreateResumeDto) {
    // Check if profile exists
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // Validate Skills
      const skills = await tx.skill.findMany({
        where: {
          id: { in: dto.skillIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (skills.length !== dto.skillIds.length) {
        throw new BadRequestException('One or more skills are invalid.');
      }

      // Validate Experiences
      const experiences = await tx.experience.findMany({
        where: {
          id: { in: dto.experienceIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (experiences.length !== dto.experienceIds.length) {
        throw new BadRequestException('One or more experiences are invalid.');
      }

      // Validate Projects
      const projects = await tx.project.findMany({
        where: {
          id: { in: dto.projectIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (projects.length !== dto.projectIds.length) {
        throw new BadRequestException('One or more projects are invalid.');
      }

      // Validate Certificates
      const certificates = await tx.certificate.findMany({
        where: {
          id: { in: dto.certificateIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (certificates.length !== dto.certificateIds.length) {
        throw new BadRequestException('One or more certificates are invalid.');
      }

      // Validate Languages
      const languages = await tx.language.findMany({
        where: {
          id: { in: dto.languageIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (languages.length !== dto.languageIds.length) {
        throw new BadRequestException('One or more languages are invalid.');
      }

      // Create Resume
      const resume = await tx.resume.create({
        data: {
          title: dto.title,
          template: dto.template,
          jobDescription: dto.jobDescription,
          generatedSummary: dto.generatedSummary,
          profileId: profile.id,
        },
      });

      // Resume Skills
      if (dto.skillIds.length) {
        await tx.resumeSkill.createMany({
          data: dto.skillIds.map((skillId) => ({
            resumeId: resume.id,
            skillId,
          })),
        });
      }

      // Resume Experiences
      if (dto.experienceIds.length) {
        await Promise.all(
          dto.experienceIds.map((experienceId) =>
            tx.resumeExperience.create({
              data: {
                resumeId: resume.id,
                experienceId,
                customDescription:
                  dto.experienceDescriptions?.[experienceId] ?? [],
              },
            }),
          ),
        );
      }

      // Resume Projects
      if (dto.projectIds.length) {
        await Promise.all(
          dto.projectIds.map((projectId) =>
            tx.resumeProject.create({
              data: {
                resumeId: resume.id,
                projectId,
                customizedDescription:
                  dto.projectDescriptions?.[projectId] ?? '',
              },
            }),
          ),
        );
      }

      // Resume Certificates
      if (dto.certificateIds.length) {
        await tx.resumeCertificate.createMany({
          data: dto.certificateIds.map((certificateId) => ({
            resumeId: resume.id,
            certificateId,
          })),
        });
      }

      // Resume Languages
      if (dto.languageIds.length) {
        await tx.resumeLanguage.createMany({
          data: dto.languageIds.map((languageId) => ({
            resumeId: resume.id,
            languageId,
          })),
        });
      }

      return tx.resume.findUnique({
        where: {
          id: resume.id,
        },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          experiences: {
            include: {
              experience: true,
            },
          },
          projects: {
            include: {
              project: true,
            },
          },
          certificates: {
            include: {
              certificate: true,
            },
          },
          languages: {
            include: {
              language: true,
            },
          },
        },
      });
    });
  }

  /**
   *
   * @param userId
   * @param jobDescription
   * @returns
   */
  async createByJobDescription(userId: string, jobDescription: string) {
    const aiResume = await this.aiService.optimizeResume(
      userId,
      jobDescription,
    );

    const dto: CreateResumeDto = {
      title: 'AI Optimized Resume',
      template: ResumeTemplate.MODERN,
      jobDescription,

      generatedSummary: aiResume.summary,

      skillIds: aiResume.skillIds,

      experienceIds: aiResume.experienceIds,

      experienceDescriptions: aiResume.experienceDescriptions,

      projectDescriptions: aiResume.projectDescriptions,

      projectIds: aiResume.projectIds,

      educationIds: aiResume.educationIds,

      certificateIds: aiResume.certificateIds,

      languageIds: aiResume.languageIds,
    };

    return this.create(userId, dto);
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

    return this.prisma.resume.findMany({
      where: { profileId: profile.id },
    });
  }

  /**
   *
   * @param userId
   * @param resumeId
   * @returns
   */
  async findOne(userId: string, resumeId: string) {
    // Check if profile exists
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // get resume with all relations
    const resume = await this.prisma.resume.findFirst({
      where: {
        id: resumeId,
        profileId: profile.id,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        experiences: {
          include: {
            experience: true,
          },
        },
        projects: {
          include: {
            project: true,
          },
        },
        certificates: {
          include: {
            certificate: true,
          },
        },
        languages: {
          include: {
            language: true,
          },
        },
        educations: {
          include: {
            education: true,
          },
        },
      },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }
  /**
   *
   * @param userId
   * @param resumeId
   * @param dto
   * @returns
   */
  async update(userId: string, resumeId: string, dto: UpdateResumeDto) {
    // Check if profile exists
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const resume = await this.prisma.resume.findFirst({
      where: {
        id: resumeId,
        profileId: profile.id,
      },
      select: { id: true },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // Validate Skills
      const skills = await tx.skill.findMany({
        where: {
          id: { in: dto.skillIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (dto.skillIds && skills.length !== dto.skillIds.length) {
        throw new BadRequestException('One or more skills are invalid.');
      }

      // Validate Experiences
      const experiences = await tx.experience.findMany({
        where: {
          id: { in: dto.experienceIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (
        dto.experienceIds &&
        experiences.length !== dto.experienceIds.length
      ) {
        throw new BadRequestException('One or more experiences are invalid.');
      }

      // Validate Projects
      const projects = await tx.project.findMany({
        where: {
          id: { in: dto.projectIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (dto.projectIds && projects.length !== dto.projectIds.length) {
        throw new BadRequestException('One or more projects are invalid.');
      }

      // Validate Certificates
      const certificates = await tx.certificate.findMany({
        where: {
          id: { in: dto.certificateIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (
        dto.certificateIds &&
        certificates.length !== dto.certificateIds.length
      ) {
        throw new BadRequestException('One or more certificates are invalid.');
      }

      // Validate Languages
      const languages = await tx.language.findMany({
        where: {
          id: { in: dto.languageIds },
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (dto.languageIds && languages.length !== dto.languageIds.length) {
        throw new BadRequestException('One or more languages are invalid.');
      }

      await tx.resume.update({
        where: { id: resume.id },
        data: {
          title: dto.title,
          template: dto.template,
          jobDescription: dto.jobDescription,
          generatedSummary: dto.generatedSummary,
        },
      });

      // Skills
      if (dto.skillIds) {
        await tx.resumeSkill.deleteMany({
          where: { resumeId: resume.id },
        });

        await tx.resumeSkill.createMany({
          data: dto.skillIds.map((skillId) => ({
            resumeId: resume.id,
            skillId,
          })),
        });
      }

      // Experiences
      if (dto.experienceIds) {
        await tx.resumeExperience.deleteMany({
          where: { resumeId: resume.id },
        });

        await tx.resumeExperience.createMany({
          data: dto.experienceIds.map((experienceId) => ({
            resumeId: resume.id,
            experienceId,
          })),
        });
      }

      // Projects
      if (dto.projectIds) {
        await tx.resumeProject.deleteMany({
          where: { resumeId: resume.id },
        });

        await tx.resumeProject.createMany({
          data: dto.projectIds.map((projectId) => ({
            resumeId: resume.id,
            projectId,
            customizedDescription: dto.projectDescriptions?.[projectId] ?? '',
          })),
        });
      }

      // Certificates
      if (dto.certificateIds) {
        await tx.resumeCertificate.deleteMany({
          where: { resumeId: resume.id },
        });

        await tx.resumeCertificate.createMany({
          data: dto.certificateIds.map((certificateId) => ({
            resumeId: resume.id,
            certificateId,
          })),
        });
      }

      // Languages
      if (dto.languageIds) {
        await tx.resumeLanguage.deleteMany({
          where: { resumeId: resume.id },
        });

        await tx.resumeLanguage.createMany({
          data: dto.languageIds.map((languageId) => ({
            resumeId: resume.id,
            languageId,
          })),
        });
      }

      return tx.resume.findUnique({
        where: { id: resume.id },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          experiences: {
            include: {
              experience: true,
            },
          },
          projects: {
            include: {
              project: true,
            },
          },
          certificates: {
            include: {
              certificate: true,
            },
          },
          languages: {
            include: {
              language: true,
            },
          },
          educations: {
            include: {
              education: true,
            },
          },
        },
      });
    });
  }

  /**
   *
   * @param userId
   * @param resumeId
   * @returns
   */
  async remove(userId: string, resumeId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return this.prisma.resume.delete({
      where: { id: resume.id },
    });
  }
}
