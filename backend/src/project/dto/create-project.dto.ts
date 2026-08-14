import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  // @IsUrl({ protocols: ['http', 'https'] })
  @IsOptional()
  @IsUrl()
  github?: string;

  // @IsUrl({ protocols: ['http', 'https'] })
  @IsOptional()
  @IsUrl()
  liveDemo?: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
