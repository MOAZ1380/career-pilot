import { z } from "zod";
import { EMPLOYMENT_TYPE } from "../types/experience";

const optionalString = (schema: z.ZodString) =>
  schema.optional().or(z.literal(""));

export const experienceSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, "Company is required")
      .max(120, "Company must not exceed 120 characters"),

    position: z
      .string()
      .trim()
      .min(1, "Position is required")
      .max(120, "Position must not exceed 120 characters"),

    employmentType: z.enum(EMPLOYMENT_TYPE, {
      message: "Select a valid employment type",
    }),

    location: optionalString(
      z.string().max(120, "Location must not exceed 120 characters"),
    ),

    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Start date must be a valid date",
      ),

    endDate: z
      .string()
      .optional()
      .refine(
        (val) => val === "" || val === undefined || !isNaN(Date.parse(val)),
        "End date must be a valid date",
      ),

    currentlyWorking: z.boolean(),

    descriptionInput: z.string(),

    technologiesInput: z.string(),
  })
  .refine(
    (data) => {
      if (data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (!data.currentlyWorking && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless currently working here",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (data.currentlyWorking && data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be empty when currently working here",
      path: ["endDate"],
    },
  );

export type ExperienceFormData = z.infer<typeof experienceSchema>;
