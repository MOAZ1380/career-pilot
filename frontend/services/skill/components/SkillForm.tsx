"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { skillSchema, type SkillFormData } from "../schemas/skill.schema";
import { type Skill, SKILL_LEVELS, SKILL_LEVEL_LABELS } from "../types/skill";
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "../api/skill.service";

const EMPTY_FORM: SkillFormData = {
  name: "",
  level: "BEGINNER",
  yearsOfExperience: "",
};

function formatYears(years: number): string {
  return `${years} ${years === 1 ? "year" : "years"}`;
}

export default function SkillForm() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    mode: "onBlur",
    defaultValues: { ...EMPTY_FORM },
  });

  const loadSkills = useCallback(async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch {
      /* List is non-critical — keep the form usable on failure */
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getSkills()
      .then((data) => {
        if (active) setSkills(data);
      })
      .catch(() => {
        /* List is non-critical — keep the form usable on failure */
      })
      .finally(() => {
        if (active) setIsLoadingList(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    clearErrors("root");
    reset({ ...EMPTY_FORM });
  }, [reset, clearErrors]);

  const startEditing = useCallback(
    (skill: Skill) => {
      setEditingId(skill.id);
      setSuccess("");
      setDeleteConfirmId(null);
      clearErrors("root");

      reset({
        name: skill.name,
        level: skill.level,
        yearsOfExperience: String(skill.yearsOfExperience),
      });
    },
    [reset, clearErrors],
  );

  const onSubmit = async (data: SkillFormData) => {
    setSuccess("");
    setError("root", {});

    const name = data.name.trim();

    const isDuplicate = skills.some(
      (skill) =>
        skill.id !== editingId &&
        skill.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (isDuplicate) {
      setError("name", {
        type: "validate",
        message: "This skill is already in your list.",
      });
      return;
    }

    const payload = {
      name,
      level: data.level,
      yearsOfExperience: Number(data.yearsOfExperience),
    };

    try {
      if (editingId) {
        await updateSkill(editingId, payload);
        setSuccess("Skill updated successfully.");
      } else {
        await createSkill(payload);
        setSuccess("Skill added successfully.");
      }

      resetForm();
      await loadSkills();
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
        await deleteSkill(id);

        if (editingId === id) {
          resetForm();
        }

        setSuccess("Skill deleted.");
        await loadSkills();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const serverMessage = error.response?.data?.message;
          setError("root", {
            type: "server",
            message:
              typeof serverMessage === "string"
                ? serverMessage
                : "Failed to delete skill.",
          });
          return;
        }

        setError("root", {
          type: "server",
          message: "Failed to delete skill.",
        });
      }
    },
    [editingId, resetForm, loadSkills, setError],
  );

  return (
    <div className="w-full max-w-2xl rounded border p-6 shadow">
      <h1 className="mb-1 text-2xl font-bold">
        {editingId ? "Edit Skill" : "Skills"}
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        {editingId
          ? "Update your skill details."
          : "Add your professional skills."}
      </p>

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Skill Name */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Skill Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. TypeScript"
            autoComplete="off"
            maxLength={100}
            disabled={isSubmitting}
            {...register("name")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Level */}
        <div>
          <label htmlFor="level" className="mb-1 block text-sm font-medium">
            Level <span className="text-red-500">*</span>
          </label>
          <select
            id="level"
            disabled={isSubmitting}
            {...register("level")}
            className="w-full rounded border p-2 disabled:opacity-50"
          >
            {SKILL_LEVELS.map((level) => (
              <option key={level} value={level}>
                {SKILL_LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>
          )}
        </div>

        {/* Years of Experience */}
        <div>
          <label
            htmlFor="yearsOfExperience"
            className="mb-1 block text-sm font-medium"
          >
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <input
            id="yearsOfExperience"
            type="number"
            inputMode="numeric"
            min={0}
            max={60}
            step={1}
            placeholder="e.g. 3"
            disabled={isSubmitting}
            {...register("yearsOfExperience")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.yearsOfExperience && (
            <p className="mt-1 text-sm text-red-500">
              {errors.yearsOfExperience.message}
            </p>
          )}
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
                ? "Update Skill"
                : "Add Skill"}
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

      {/* ─── Skill List ─── */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Your Skills</h2>

        {isLoadingList ? (
          <p className="text-sm text-gray-500">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="text-sm text-gray-500">
            No skills added yet. Fill the form above to get started.
          </p>
        ) : (
          <ul className="space-y-2">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="rounded border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{skill.name}</h3>
                    <p className="text-xs text-gray-400">
                      {SKILL_LEVEL_LABELS[skill.level]} ·{" "}
                      {formatYears(skill.yearsOfExperience)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(skill)}
                      disabled={isSubmitting}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    {deleteConfirmId === skill.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(skill.id)}
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
                        onClick={() => setDeleteConfirmId(skill.id)}
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
