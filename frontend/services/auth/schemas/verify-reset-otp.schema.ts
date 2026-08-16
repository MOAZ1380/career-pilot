import { z } from "zod";

export const verifyResetOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyResetOtpFormData = z.infer<typeof verifyResetOtpSchema>;
