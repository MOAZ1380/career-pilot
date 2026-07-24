export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface Skill {
  id: string;

  name: string;
  level: SkillLevel;
  yearsOfExperience: number;

  profileId: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillDto {
  name: string;
  level: SkillLevel;
  yearsOfExperience: number;
}

export interface UpdateSkillDto extends Partial<CreateSkillDto> {}
