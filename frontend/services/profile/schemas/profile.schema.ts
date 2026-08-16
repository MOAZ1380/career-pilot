import { z } from "zod";
const optionalString = (schema: z.ZodString) =>
  schema.optional().or(z.literal(""));

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),

  headline: optionalString(
    z.string().max(100, "Headline must not exceed 100 characters"),
  ),

  bio: optionalString(
    z.string().max(1000, "Bio must not exceed 1000 characters"),
  ),

  image: optionalString(z.string().url("Invalid image URL")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
