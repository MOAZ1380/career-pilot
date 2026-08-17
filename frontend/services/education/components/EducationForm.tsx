"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  educationSchema,
  type EducationFormData,
} from "../schemas/education.schema";
import {
  createEducation,
  deleteEducation,
  getEducations,
  updateEducation,
} from "../api/education.service";
import type { Education } from "../types/education";

export default function EducationForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: "onBlur",
    defaultValues: {
      university: "",
      degree: "",
      field: "",
      grade: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  const loadEducations = async () => {
    try {
      const data = await getEducations();
      setEducations(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setEducations([]);
        return;
      }

      setError("root", {
        type: "server",
        message: "Failed to load educations.",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadEducations();
      setIsLoading(false);
    };

    init();
  }, [setError]);

  const onSubmit = async (data: EducationFormData) => {
    setSuccess("");
    setError("root", {});

    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== undefined,
      ),
    ) as EducationFormData;

    try {
      if (editingId) {
        await updateEducation(editingId, cleanedData);
        setSuccess("Education updated successfully.");
        setEditingId(null);
      } else {
        await createEducation(cleanedData);
        setSuccess("Education created successfully.");
      }

      reset();
      await loadEducations();
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

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setSuccess("");

    reset({
      university: education.university,
      degree: education.degree,
      field: education.field,
      grade: education.grade ?? "",
      description: education.description ?? "",
      startDate: education.startDate.split("T")[0],
      endDate: education.endDate
        ? education.endDate.split("T")[0]
        : "",
    });
  };

  const handleDelete = async (id: string) => {
    setSuccess("");
    setError("root", {});

    try {
      await deleteEducation(id);
      setSuccess("Education deleted successfully.");
      await loadEducations();

      if (editingId === id) {
        setEditingId(null);
        reset();
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

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl rounded border p-6 shadow">
        <p className="text-sm text-gray-600">Loading educations...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded border p-6 shadow">
      <h1 className="mb-2 text-2xl font-bold">
        {editingId ? "Edit Education" : "Add Education"}
      </h1>

      <p className="mb-6 text-sm text-gray-600">
        {editingId
          ? "Update your education details."
          : "Add a new education entry to your profile."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* University */}
        <div>
          <label htmlFor="university" className="mb-1 block text-sm font-medium">
            University
          </label>

          <input
            id="university"
            type="text"
            placeholder="e.g. Cairo University"
            disabled={isSubmitting}
            {...register("university")}
            className="w-full rounded border p-2"
          />

          {errors.university && (
            <p className="mt-1 text-sm text-red-500">
              {errors.university.message}
            </p>
          )}
        </div>

        {/* Degree */}
        <div>
          <label htmlFor="degree" className="mb-1 block text-sm font-medium">
            Degree
          </label>

          <input
            id="degree"
            type="text"
            placeholder="e.g. Bachelor of Science"
            disabled={isSubmitting}
            {...register("degree")}
            className="w-full rounded border p-2"
          />

          {errors.degree && (
            <p className="mt-1 text-sm text-red-500">
              {errors.degree.message}
            </p>
          )}
        </div>

        {/* Field */}
        <div>
          <label htmlFor="field" className="mb-1 block text-sm font-medium">
            Field of Study
          </label>

          <input
            id="field"
            type="text"
            placeholder="e.g. Computer Science"
            disabled={isSubmitting}
            {...register("field")}
            className="w-full rounded border p-2"
          />

          {errors.field && (
            <p className="mt-1 text-sm text-red-500">
              {errors.field.message}
            </p>
          )}
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="grade" className="mb-1 block text-sm font-medium">
            Grade
          </label>

          <input
            id="grade"
            type="text"
            placeholder="e.g. 3.8 / 4.0"
            disabled={isSubmitting}
            {...register("grade")}
            className="w-full rounded border p-2"
          />

          {errors.grade && (
            <p className="mt-1 text-sm text-red-500">
              {errors.grade.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>

          <textarea
            id="description"
            rows={4}
            placeholder="Additional details about your education..."
            disabled={isSubmitting}
            {...register("description")}
            className="w-full resize-none rounded border p-2"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="mb-1 block text-sm font-medium">
            Start Date
          </label>

          <input
            id="startDate"
            type="date"
            disabled={isSubmitting}
            {...register("startDate")}
            className="w-full rounded border p-2"
          />

          {errors.startDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="mb-1 block text-sm font-medium">
            End Date
          </label>

          <input
            id="endDate"
            type="date"
            placeholder="Leave empty if still attending"
            disabled={isSubmitting}
            {...register("endDate")}
            className="w-full rounded border p-2"
          />

          {errors.endDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.endDate.message}
            </p>
          )}
        </div>

        {/* Server Error */}
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        {/* Success */}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* Submit / Cancel */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
          >
            {isSubmitting
              ? editingId
                ? "Updating..."
                : "Saving..."
              : editingId
                ? "Update Education"
                : "Add Education"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full rounded border p-2 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Education List */}
      {educations.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Your Education</h2>

          <div className="space-y-4">
            {educations.map((education) => (
              <div
                key={education.id}
                className="rounded border p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{education.university}</h3>
                    <p className="text-sm text-gray-600">
                      {education.degree} in {education.field}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(education.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                      {" — "}
                      {education.endDate
                        ? new Date(education.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "Present"}
                    </p>
                    {education.grade && (
                      <p className="text-sm text-gray-500">
                        Grade: {education.grade}
                      </p>
                    )}
                    {education.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {education.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(education)}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(education.id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
