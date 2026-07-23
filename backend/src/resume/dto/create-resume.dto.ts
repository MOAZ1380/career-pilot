import { ResumeTemplate } from '@prisma/client';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateResumeDto {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsEnum(ResumeTemplate)
  template!: ResumeTemplate;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  jobDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  generatedSummary?: string;

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  skillIds!: string[];

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  experienceIds!: string[];

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  projectIds!: string[];

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  certificateIds!: string[];

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  languageIds!: string[];
}
