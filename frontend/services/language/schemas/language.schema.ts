import { z } from "zod";
import { LANGUAGE_LEVELS } from "../types/language";

export const languageSchema = z.object({
  language: z
    .string()
    .trim()
    .min(1, "Language name is required")
    .max(100, "Language name must not exceed 100 characters"),

  level: z.enum(LANGUAGE_LEVELS, {
    message: "Select a valid level",
  }),
});

export type LanguageFormData = z.infer<typeof languageSchema>;
