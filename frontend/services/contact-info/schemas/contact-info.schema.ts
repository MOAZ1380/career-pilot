import { z } from "zod";
import { LinkType } from "../types/contact-info";

const optionalString = (schema: z.ZodString) =>
  schema.optional().or(z.literal(""));

const profileLinkSchema = z.object({
  type: z.nativeEnum(LinkType, { message: "Invalid link type" }),
  url: z
    .string()
    .trim()
    .url("Invalid URL")
    .max(500, "URL must not exceed 500 characters"),
});

export const contactInfoSchema = z.object({
  phone: optionalString(
    z.string().max(20, "Phone must not exceed 20 characters"),
  ),

  email: optionalString(
    z
      .string()
      .email("Invalid email")
      .max(100, "Email must not exceed 100 characters"),
  ),

  country: optionalString(
    z.string().max(100, "Country must not exceed 100 characters"),
  ),

  city: optionalString(
    z.string().max(100, "City must not exceed 100 characters"),
  ),

  links: z.array(profileLinkSchema).optional(),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
