export type LanguageLevel =
  "BASIC" | "CONVERSATIONAL" | "PROFESSIONAL" | "NATIVE";

export interface Language {
  id: string;

  language: string;
  level: LanguageLevel;

  profileId: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateLanguageDto {
  language: string;
  level: LanguageLevel;
}

export interface UpdateLanguageDto extends Partial<CreateLanguageDto> {}
