export const SKILL_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

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

export type UpdateSkillDto = Partial<CreateSkillDto>;
