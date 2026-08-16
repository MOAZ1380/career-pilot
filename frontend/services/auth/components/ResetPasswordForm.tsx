"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPassword } from "../api/auth.service";
import { clearResetToken, getResetToken } from "@/lib/reset-token";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/reset-password.schema";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [hasResetToken] = useState(() => Boolean(getResetToken()));

  useEffect(() => {
    if (!hasResetToken || !email) {
      router.replace("/forget-password");
    }
  }, [hasResetToken, email, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const resetToken = getResetToken();

    if (!email || !resetToken) {
      clearResetToken();

      router.replace("/forgot-password");

      return;
    }

    try {
      await resetPassword({
        email,
        resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      clearResetToken();

      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          clearResetToken();

          router.replace("/forgot-password");

          return;
        }

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
      <h1 className="mb-2 text-2xl font-bold">Reset Password</h1>

      <p className="mb-6 text-sm text-gray-600">
        Choose a new password for{" "}
        <span className="font-medium text-black">{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* New Password */}
        <div>
          <label htmlFor="password" className="mb-1 block">
            New Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="New Password"
            disabled={isSubmitting}
            autoComplete="new-password"
            {...register("password")}
            className="w-full rounded border p-2"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-1 block">
            Confirm New Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            disabled={isSubmitting}
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="w-full rounded border p-2"
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
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
          {isSubmitting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}
