import { z } from "zod";

const optionalString = (schema: z.ZodString) =>
  schema.optional().or(z.literal(""));

export const educationSchema = z.object({
  university: z
    .string()
    .trim()
    .min(1, "University is required")
    .max(150, "University must not exceed 150 characters"),

  degree: z
    .string()
    .trim()
    .min(1, "Degree is required")
    .max(150, "Degree must not exceed 150 characters"),

  field: z
    .string()
    .trim()
    .min(1, "Field of study is required")
    .max(150, "Field must not exceed 150 characters"),

  grade: optionalString(
    z.string().max(100, "Grade must not exceed 100 characters"),
  ),

  description: optionalString(
    z.string().max(500, "Description must not exceed 500 characters"),
  ),

  startDate: z.string().min(1, "Start date is required"),

  endDate: optionalString(z.string()),
});

export type EducationFormData = z.infer<typeof educationSchema>;
