import { ResumeTemplate } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsEnum(ResumeTemplate)
  template: ResumeTemplate;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  jobDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  generatedSummary?: string;
}
