import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LinkType } from '@prisma/client';

export class CreateProfileLinkDto {
  @IsEnum(LinkType)
  type: LinkType;

  @IsUrl()
  @MaxLength(500)
  url: string;
}

export class CreateContactInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProfileLinkDto)
  links?: CreateProfileLinkDto[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;
}
