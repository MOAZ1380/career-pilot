import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(150)
  issuer: string;

  @Type(() => Date)
  @IsDate()
  issueDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expirationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  credentialId?: string;

  @IsOptional()
  @IsUrl()
  credentialUrl?: string;
}
