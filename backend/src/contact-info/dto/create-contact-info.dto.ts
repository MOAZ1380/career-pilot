import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateContactInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  linkedIn?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  github?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  portfolio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;
}
