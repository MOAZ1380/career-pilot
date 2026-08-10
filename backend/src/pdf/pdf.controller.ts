import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('pdf')
@UseGuards(JwtAuthGuard)
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get(':resumeId')
  async downloadPdf(@Param('resumeId') resumeId: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generatePdf(resumeId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-${resumeId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
