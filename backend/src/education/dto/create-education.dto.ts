import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @MaxLength(150)
  university: string;

  @IsString()
  @MaxLength(150)
  degree: string;

  @IsString()
  @MaxLength(150)
  field: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  grade?: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
