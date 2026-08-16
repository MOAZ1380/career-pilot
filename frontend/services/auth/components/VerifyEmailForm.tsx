"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ResendVerificationOtp from "./ResendVerificationOtp";

import { verifyEmail } from "../api/auth.service";
import {
  verifyEmailSchema,
  type VerifyEmailFormData,
} from "../schemas/verify-email.schema";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    if (!email) {
      setError("root", {
        type: "client",
        message: "Email is missing. Please register again.",
      });

      return;
    }

    try {
      await verifyEmail({
        email,
        otp: data.otp,
      });

      router.push("/login");
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
      <h1 className="mb-2 text-2xl font-bold">Verify Email</h1>

      <p className="mb-6 text-sm text-gray-600">
        Enter the 6-digit verification code sent to{" "}
        <span className="font-medium text-black">{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="otp" className="mb-1 block">
            Verification Code
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

        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify Email"}
        </button>

        {email && <ResendVerificationOtp email={email} />}
      </form>
    </div>
  );
}
