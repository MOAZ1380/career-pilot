import { LanguageLevel } from '@prisma/client';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @MaxLength(100)
  language: string;

  @IsEnum(LanguageLevel)
  level: LanguageLevel;
}
