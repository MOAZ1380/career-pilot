"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPassword } from "../api/auth.service";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgot-password.schema";

export default function ForgetPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data);

      router.push(`/verify-reset-otp?email=${encodeURIComponent(data.email)}`);
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
      <h1 className="mb-2 text-2xl font-bold">Forgot Password</h1>

      <p className="mb-6 text-sm text-gray-600">
        Enter your account email and we will send you a password reset code
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1 block">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Email"
            disabled={isSubmitting}
            autoComplete="email"
            {...register("email")}
            className="w-full rounded border p-2"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
          {isSubmitting ? "Sending..." : "Send reset code"}
        </button>
      </form>
    </div>
  );
}
