import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  private readonly userId = '1';

  @Post()
  create(@Body() dto: CreateCertificateDto) {
    return this.certificateService.create(this.userId, dto);
  }

  @Get()
  findMe() {
    return this.certificateService.findMe(this.userId);
  }

  @Patch()
  update(@Body() dto: UpdateCertificateDto) {
    return this.certificateService.update(this.userId, dto);
  }

  @Delete()
  remove() {
    return this.certificateService.remove(this.userId);
  }
}
