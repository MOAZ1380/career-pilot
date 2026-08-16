"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "../api/profile.service";

export default function ProfileForm() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      headline: "",
      bio: "",
      image: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setProfileExists(true);

        reset({
          firstName: profile.firstName,
          lastName: profile.lastName,
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
          image: profile.image ?? "",
        });
      } catch (error: unknown) {
        /*
         * Profile doesn't exist yet.
         * This is normal for a new user.
         */
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 404) {
            setProfileExists(false);
            return;
          }
        }

        setError("root", {
          type: "server",
          message: "Failed to load profile.",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [reset, setError]);

  const onSubmit = async (data: ProfileFormData) => {
    setSuccess("");
    setError("root", {});

    // Remove empty optional fields
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== undefined,
      ),
    ) as ProfileFormData;

    try {
      if (profileExists) {
        const profile = await updateProfile(cleanedData);

        reset({
          firstName: profile.firstName,
          lastName: profile.lastName,
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
          image: profile.image ?? "",
        });

        setSuccess("Profile updated successfully.");
      } else {
        const profile = await createProfile(cleanedData);

        setProfileExists(true);
        reset({
          firstName: profile.firstName,
          lastName: profile.lastName,
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
          image: profile.image ?? "",
        });

        setSuccess("Profile created successfully.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError("root", {
          type: "server",
          message:
            typeof message === "string"
              ? message
              : "Something went wrong. Please try again.",
        });

        return;
      }

      setError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="w-full max-w-2xl rounded border p-6 shadow">
        <p className="text-sm text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded border p-6 shadow">
      <h1 className="mb-2 text-2xl font-bold">
        {profileExists ? "Edit Profile" : "Create Profile"}
      </h1>

      <p className="mb-6 text-sm text-gray-600">
        {profileExists
          ? "Update your profile information."
          : "Complete your profile information."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            placeholder="First name"
            autoComplete="given-name"
            disabled={isSubmitting}
            {...register("firstName")}
            className="w-full rounded border p-2"
          />

          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            placeholder="Last name"
            autoComplete="family-name"
            disabled={isSubmitting}
            {...register("lastName")}
            className="w-full rounded border p-2"
          />

          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Headline */}
        <div>
          <label htmlFor="headline" className="mb-1 block text-sm font-medium">
            Headline
          </label>

          <input
            id="headline"
            type="text"
            placeholder="e.g. Backend Developer"
            disabled={isSubmitting}
            {...register("headline")}
            className="w-full rounded border p-2"
          />

          {errors.headline && (
            <p className="mt-1 text-sm text-red-500">
              {errors.headline.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="mb-1 block text-sm font-medium">
            Bio
          </label>

          <textarea
            id="bio"
            rows={5}
            placeholder="Tell us about yourself..."
            disabled={isSubmitting}
            {...register("bio")}
            className="w-full resize-none rounded border p-2"
          />

          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium">
            Profile Image URL
          </label>

          <input
            id="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
            {...register("image")}
            className="w-full rounded border p-2"
          />

          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
          )}
        </div>

        {/* Server Error */}
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        {/* Success */}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? profileExists
              ? "Updating profile..."
              : "Creating profile..."
            : profileExists
              ? "Update Profile"
              : "Create Profile"}
        </button>
      </form>
    </div>
  );
}
