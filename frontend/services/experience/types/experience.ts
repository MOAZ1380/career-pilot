export type EmploymentType =
  "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

export interface Experience {
  id: string;

  company: string;
  position: string;
  employmentType: EmploymentType;

  location?: string | null;

  startDate: string;
  endDate?: string | null;

  currentlyWorking: boolean;

  description: string[];

  technologies: string[];

  profileId: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceDto {
  company: string;
  position: string;

  employmentType: EmploymentType;

  location?: string;

  startDate: string;
  endDate?: string;

  currentlyWorking: boolean;

  description: string[];

  technologies: string[];
}

export interface UpdateExperienceDto extends Partial<CreateExperienceDto> {}
