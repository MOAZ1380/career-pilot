import { z } from "zod";
import { ResumeTemplate } from "../types/resume";

const uuidArray = z.array(z.string().uuid());

const descriptionRecord = z.record(z.string(), z.array(z.string().max(4000)));

const projectDescriptionRecord = z.record(z.string(), z.string().max(4000));

export const resumeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must not exceed 150 characters"),

  template: z.nativeEnum(ResumeTemplate),

  jobDescription: z
    .string()
    .max(4000, "Job description must not exceed 4000 characters")
    .optional()
    .or(z.literal("")),

  generatedSummary: z
    .string()
    .max(4000, "Summary must not exceed 4000 characters")
    .optional()
    .or(z.literal("")),

  skillIds: uuidArray,

  experienceIds: uuidArray,

  educationIds: uuidArray,

  projectIds: uuidArray,

  certificateIds: uuidArray,

  languageIds: uuidArray,

  experienceDescriptions: descriptionRecord,

  projectDescriptions: projectDescriptionRecord,
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
