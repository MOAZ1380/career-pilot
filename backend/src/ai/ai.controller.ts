import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  async ai() {
    return await this.aiService.generateSummary();
  }
}
