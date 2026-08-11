import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { OptimizeResumeDto } from './dto/optimize-resume.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  userId = '1';
  @Post('/optimize-resume')
  async optimizeResume(@Body() dto: OptimizeResumeDto) {
    return this.aiService.optimizeResume(dto.jobDescription, user.sub);
  }
}
