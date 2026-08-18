export interface Project {
  id: string;
  name: string;
  description: string;
  github: string | null;
  liveDemo: string | null;
  technologies: string[];
  startDate: string | null;
  endDate: string | null;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  github?: string;
  liveDemo?: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;
