import { Experience } from "@/services/experience/types/experience";
import { Language } from "@/services/language/types/language";
import { Skill } from "@/services/skill/types/skill";
import { Certificate } from "@/services/certificate/types/certificate";
import { Project } from "@/services/project/types/project";

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
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  certificates: Certificate[];
  languages: Language[];
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
