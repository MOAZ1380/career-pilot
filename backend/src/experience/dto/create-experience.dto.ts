import { EmploymentType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @MaxLength(120)
  company: string;

  @IsString()
  @MaxLength(120)
  position: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsBoolean()
  currentlyWorking: boolean;

  @IsArray()
  @IsString({ each: true })
  description: string[];

  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}
