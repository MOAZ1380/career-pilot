import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get(':resumeId')
  async downloadPdf(@Param('resumeId') resumeId: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generatePdf(
      (resumeId = '2020adf0-5ddf-47d4-90de-6f8ff8ebc226'),
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-${resumeId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
