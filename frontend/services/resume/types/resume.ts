export type ResumeTemplate = "MODERN" | "CLASSIC" | "MINIMAL";

export interface Resume {
  id: string;

  title: string;
  template: ResumeTemplate;

  jobDescription?: string | null;
  generatedSummary?: string | null;

  profileId: string;

  createdAt: string;
  updatedAt: string;
}

export interface ResumeDetails extends Resume {
  skills: any[];
  experiences: any[];
  projects: any[];
  certificates: any[];
  languages: any[];
}

export interface CreateResumeDto {
  title: string;
  template: ResumeTemplate;

  jobDescription?: string;
  generatedSummary?: string;

  skillIds: string[];
  experienceIds: string[];
  projectIds: string[];
  certificateIds: string[];
  languageIds: string[];
}

export interface UpdateResumeDto extends Partial<CreateResumeDto> {}
