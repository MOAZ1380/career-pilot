import { IsObject, IsString } from 'class-validator';

export class OptimizeResumeDto {
  @IsString()
  jobDescription: string;
}
