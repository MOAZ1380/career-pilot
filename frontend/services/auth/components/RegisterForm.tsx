"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { register } from "@/services/auth/api/auth.service";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/register.schema";
import { useState } from "react";

export default function RegisterForm() {
  const [success, setSuccess] = useState("");
  const {
    register: registerInput,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSuccess("");
    try {
      const response = await register(data);
      setSuccess(response.message);
      // بعدين ممكن تعمل:
      // router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Username */}
      <div>
        <label htmlFor="username">Username</label>

        <input
          id="username"
          type="text"
          placeholder="Username"
          disabled={isSubmitting}
          autoComplete="username"
          {...registerInput("username")}
          className="w-full rounded border p-2"
        />

        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          placeholder="Email"
          disabled={isSubmitting}
          autoComplete="email"
          {...registerInput("email")}
          className="w-full rounded border p-2"
        />

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          placeholder="Password"
          disabled={isSubmitting}
          autoComplete="new-password"
          {...registerInput("password")}
          className="w-full rounded border p-2"
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>

        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          disabled={isSubmitting}
          autoComplete="new-password"
          {...registerInput("confirmPassword")}
          className="w-full rounded border p-2"
        />

        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Server / General Error */}
      {errors.root && (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      {success && <p className="text-sm text-green-500">{success}</p>}
    </form>
  );
}
