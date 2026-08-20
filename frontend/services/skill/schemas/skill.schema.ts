import { z } from "zod";
import { SKILL_LEVELS } from "../types/skill";

/**
 * Upper bound for years of experience. The backend only enforces >= 0,
 * so this guard stops absurd values (typos like repeated digits) from
 * ever reaching the API.
 */
const MAX_YEARS_OF_EXPERIENCE = 60;

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required")
    .max(100, "Skill name must not exceed 100 characters"),

  level: z.enum(SKILL_LEVELS, {
    message: "Select a valid level",
  }),

  yearsOfExperience: z
    .string()
    .trim()
    .min(1, "Years of experience is required")
    .regex(/^\d+$/, "Years of experience must be a whole number")
    .refine(
      (value) => Number(value) <= MAX_YEARS_OF_EXPERIENCE,
      `Years of experience cannot exceed ${MAX_YEARS_OF_EXPERIENCE}`,
    ),
});

export type SkillFormData = z.infer<typeof skillSchema>;
