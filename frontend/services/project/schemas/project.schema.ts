import { z } from "zod";

const optionalString = (schema: z.ZodString) =>
  schema.optional().or(z.literal(""));

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must not exceed 120 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must not exceed 2000 characters"),

  github: optionalString(z.string().trim().url("Invalid GitHub URL")),

  liveDemo: optionalString(z.string().trim().url("Invalid live demo URL")),

  technologies: z
    .array(z.string().trim().min(1, "Technology is required"))
    .min(1, "Add at least one technology"),

  startDate: optionalString(z.string()),

  endDate: optionalString(z.string()),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
