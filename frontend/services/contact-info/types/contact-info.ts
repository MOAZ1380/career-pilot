export interface ContactInfo {
  id: string;
  phone?: string | null;
  email?: string | null;
  links?: string[] | null;
  country?: string | null;
  city?: string | null;

  profileId: string;
}

export interface CreateContactInfoDto {
  phone?: string;
  email?: string;
  links?: string[];
  country?: string;
  city?: string;
}

export interface UpdateContactInfoDto extends Partial<CreateContactInfoDto> {}
