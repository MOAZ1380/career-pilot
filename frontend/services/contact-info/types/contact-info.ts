export interface ContactInfo {
  id: string;
  phone?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  portfolio?: string | null;
  country?: string | null;
  city?: string | null;

  profileId: string;
}

export interface CreateContactInfoDto {
  phone?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  country?: string;
  city?: string;
}

export interface UpdateContactInfoDto extends Partial<CreateContactInfoDto> {}
