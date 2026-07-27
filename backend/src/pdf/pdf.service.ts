import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResumeService } from 'src/resume/resume.service';
import { PdfGenerator } from './generators/pdf-generator.service';
import { ProfileService } from 'src/profile/profile.service';
import { mapResumeToCvData } from './resume-mapper';

@Injectable()
export class PdfService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeService,
    private readonly profileService: ProfileService,
  ) {}

  userId = '1';

  async generatePdf(resumeId: string): Promise<Buffer> {
    // Logic to generate PDF from resume data
    const resume = await this.resumeService.findOne(this.userId, resumeId);
    const profile = await this.profileService.findMe(this.userId);

    const cvData = mapResumeToCvData(resume, profile);
    const pdfBuffer = await PdfGenerator.generatePdf(cvData);
    return pdfBuffer;
  }
}
