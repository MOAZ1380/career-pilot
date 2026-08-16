"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { verifyResetOtp } from "../api/auth.service";
import { setResetToken } from "@/lib/reset-token";
import {
  verifyResetOtpSchema,
  type VerifyResetOtpFormData,
} from "../schemas/verify-reset-otp.schema";

export default function VerifyResetOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetOtpFormData>({
    resolver: zodResolver(verifyResetOtpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: VerifyResetOtpFormData) => {
    if (!email) {
      setError("root", {
        type: "client",
        message: "Email is missing. Please restart the password reset.",
      });

      return;
    }

    try {
      const response = await verifyResetOtp({
        email,
        otp: data.otp,
      });

      setResetToken(response.data.resetToken);

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (typeof message === "string") {
          setError("root", {
            type: "server",
            message,
          });
        } else {
          setError("root", {
            type: "server",
            message: "Something went wrong. Please try again.",
          });
        }

        return;
      }

      setError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="w-full max-w-md rounded border p-6 shadow">
      <h1 className="mb-2 text-2xl font-bold">Verify Reset Code</h1>

      <p className="mb-6 text-sm text-gray-600">
        Enter the 6-digit password reset code sent to{" "}
        <span className="font-medium text-black">{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* OTP */}
        <div>
          <label htmlFor="otp" className="mb-1 block">
            Reset Code
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit code"
            disabled={isSubmitting}
            {...register("otp")}
            className="w-full rounded border p-2 text-center tracking-widest"
          />

          {errors.otp && (
            <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
          )}
        </div>

        {/* Server / General Error */}
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify code"}
        </button>

        {/* Restart Reset Flow */}
        <div className="text-center">
          <p className="text-sm text-gray-600">{"Didn't receive the code?"}</p>

          <Link
            href="/forgot-password"
            className="mt-2 inline-block text-sm font-medium text-black underline"
          >
            Request a new reset code
          </Link>
        </div>
      </form>
    </div>
  );
}
