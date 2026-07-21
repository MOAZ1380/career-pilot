import { SkillLevel } from '@prisma/client';
import { IsEnum, IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(SkillLevel)
  level: SkillLevel;

  @IsInt()
  @Min(0)
  yearsOfExperience: number;
}
