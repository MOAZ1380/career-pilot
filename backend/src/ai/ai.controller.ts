import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { OptimizeResumeDto } from './dto/optimize-resume.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtAccessPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('/optimize-resume')
  async optimizeResume(
    @CurrentUser() user: JwtAccessPayload,
    @Body() dto: OptimizeResumeDto,
  ) {
    return this.aiService.optimizeResume(dto.jobDescription, user.sub);
  }
}
