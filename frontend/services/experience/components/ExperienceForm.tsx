"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  experienceSchema,
  type ExperienceFormData,
} from "../schemas/experience.schema";
import {
  type Experience,
  EMPLOYMENT_TYPE_LABELS,
  EMPLOYMENT_TYPE,
} from "../types/experience";
import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
} from "../api/experience.service";

const EMPTY_FORM: ExperienceFormData = {
  company: "",
  position: "",
  employmentType: "FULL_TIME",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  descriptionInput: "",
  technologiesInput: "",
};

function parseTagInput(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is string => s.length > 0);
}

function formatDateForInput(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceForm() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    mode: "onBlur",
    defaultValues: { ...EMPTY_FORM },
  });

  const currentlyWorking = useWatch({ control, name: "currentlyWorking" });

  const loadExperiences = useCallback(async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch {
      /* Silently handle — list is non-critical */
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch {
        /* list is non-critical */
      } finally {
        setIsLoadingList(false);
      }
    };

    load();
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setSuccess("");
    clearErrors("root");
    reset({ ...EMPTY_FORM });
  }, [reset, clearErrors]);

  const startEditing = useCallback(
    (exp: Experience) => {
      setEditingId(exp.id);
      setSuccess("");
      setDeleteConfirmId(null);
      clearErrors("root");

      reset({
        company: exp.company,
        position: exp.position,
        employmentType: exp.employmentType,
        location: exp.location ?? "",
        startDate: formatDateForInput(exp.startDate),
        endDate: formatDateForInput(exp.endDate),
        currentlyWorking: exp.currentlyWorking,
        descriptionInput: exp.description.join(", "),
        technologiesInput: exp.technologies.join(", "),
      });
    },
    [reset, clearErrors],
  );

  const onSubmit = async (data: ExperienceFormData) => {
    setSuccess("");
    setError("root", {});

    const description = parseTagInput(data.descriptionInput);
    const technologies = parseTagInput(data.technologiesInput);
    const payload = {
      company: data.company.trim(),
      position: data.position.trim(),
      employmentType: data.employmentType,
      location: data.location?.trim() || undefined,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      currentlyWorking: data.currentlyWorking,
      description,
      technologies,
    };

    try {
      if (editingId) {
        await updateExperience(editingId, payload);
        setSuccess("Experience updated successfully.");
      } else {
        await createExperience(payload);
        setSuccess("Experience added successfully.");
      }

      resetForm();
      await loadExperiences();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        setError("root", {
          type: "server",
          message:
            typeof serverMessage === "string"
              ? serverMessage
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

  const handleDelete = useCallback(
    async (id: string) => {
      setDeleteConfirmId(null);
      setSuccess("");
      setError("root", {});

      try {
        await deleteExperience(id);

        if (editingId === id) {
          resetForm();
        }

        setSuccess("Experience deleted.");
        await loadExperiences();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const serverMessage = error.response?.data?.message;
          setError("root", {
            type: "server",
            message:
              typeof serverMessage === "string"
                ? serverMessage
                : "Failed to delete experience.",
          });
          return;
        }

        setError("root", {
          type: "server",
          message: "Failed to delete experience.",
        });
      }
    },
    [editingId, resetForm, loadExperiences, setError],
  );

  return (
    <div className="w-full max-w-2xl rounded border p-6 shadow">
      <h1 className="mb-1 text-2xl font-bold">
        {editingId ? "Edit Experience" : "Work Experience"}
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        {editingId
          ? "Update your work experience details."
          : "Add your professional work experience."}
      </p>

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Company */}
        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            placeholder="e.g. Google"
            autoComplete="organization"
            disabled={isSubmitting}
            {...register("company")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-500">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="mb-1 block text-sm font-medium">
            Position <span className="text-red-500">*</span>
          </label>
          <input
            id="position"
            type="text"
            placeholder="e.g. Senior Backend Developer"
            autoComplete="organization-title"
            disabled={isSubmitting}
            {...register("position")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-500">
              {errors.position.message}
            </p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label
            htmlFor="employmentType"
            className="mb-1 block text-sm font-medium"
          >
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            id="employmentType"
            disabled={isSubmitting}
            {...register("employmentType")}
            className="w-full rounded border p-2 disabled:opacity-50"
          >
            {EMPLOYMENT_TYPE.map((type) => (
              <option key={type} value={type}>
                {EMPLOYMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.employmentType && (
            <p className="mt-1 text-sm text-red-500">
              {errors.employmentType.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Cairo, Egypt"
            autoComplete="address-level2"
            disabled={isSubmitting}
            {...register("location")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="mb-1 block text-sm font-medium">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            type="date"
            disabled={isSubmitting}
            {...register("startDate")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* Currently Working */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            disabled={isSubmitting}
            {...register("currentlyWorking")}
            className="h-4 w-4 rounded border-gray-300"
            onChange={(e) => {
              setValue("currentlyWorking", e.target.checked, {
                shouldValidate: true,
              });
              if (e.target.checked) {
                setValue("endDate", "", { shouldValidate: true });
              }
            }}
          />
          I am currently working here
        </label>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="mb-1 block text-sm font-medium">
            End Date
            {!currentlyWorking && (
              <span className="text-red-500"> *</span>
            )}
          </label>
          <input
            id="endDate"
            type="date"
            disabled={isSubmitting || currentlyWorking}
            {...register("endDate")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.endDate.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="descriptionInput"
            className="mb-1 block text-sm font-medium"
          >
            Description{" "}
            <span className="text-xs text-gray-400">(comma-separated)</span>
          </label>
          <textarea
            id="descriptionInput"
            rows={3}
            placeholder="e.g. Led backend team, Designed microservices, Improved API latency by 40%"
            disabled={isSubmitting}
            {...register("descriptionInput")}
            className="w-full resize-none rounded border p-2 disabled:opacity-50"
          />
        </div>

        {/* Technologies */}
        <div>
          <label
            htmlFor="technologiesInput"
            className="mb-1 block text-sm font-medium"
          >
            Technologies{" "}
            <span className="text-xs text-gray-400">(comma-separated)</span>
          </label>
          <input
            id="technologiesInput"
            type="text"
            placeholder="e.g. Node.js, TypeScript, PostgreSQL, Docker"
            disabled={isSubmitting}
            {...register("technologiesInput")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
        </div>

        {/* Server Error */}
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        {/* Success */}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
                ? "Update Experience"
                : "Add Experience"}
          </button>

          {editingId && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={resetForm}
              className="rounded border px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ─── Experience List ─── */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Your Experience</h2>

        {isLoadingList ? (
          <p className="text-sm text-gray-500">Loading experiences...</p>
        ) : experiences.length === 0 ? (
          <p className="text-sm text-gray-500">
            No experience added yet. Fill the form above to get started.
          </p>
        ) : (
          <ul className="space-y-4">
            {experiences.map((exp) => (
              <li
                key={exp.id}
                className="rounded border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{exp.position}</h3>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {EMPLOYMENT_TYPE_LABELS[exp.employmentType]}
                      {exp.location ? ` · ${exp.location}` : ""}
                      {" · "}
                      {formatDisplayDate(exp.startDate)} –{" "}
                      {exp.currentlyWorking
                        ? "Present"
                        : formatDisplayDate(exp.endDate)}
                    </p>

                    {exp.description.length > 0 && (
                      <ul className="mt-2 list-inside list-disc text-sm text-gray-500">
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(exp)}
                      disabled={isSubmitting}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    {deleteConfirmId === exp.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(exp.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-sm text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(exp.id)}
                        disabled={isSubmitting}
                        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
