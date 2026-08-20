"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  languageSchema,
  type LanguageFormData,
} from "../schemas/language.schema";
import {
  type Language,
  LANGUAGE_LEVELS,
  LANGUAGE_LEVEL_LABELS,
} from "../types/language";
import {
  createLanguage,
  deleteLanguage,
  getLanguages,
  updateLanguage,
} from "../api/language.service";

const EMPTY_FORM: LanguageFormData = {
  language: "",
  level: "BASIC",
};

export default function LanguageForm() {
  const [languages, setLanguages] = useState<Language[]>([]);
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
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    mode: "onBlur",
    defaultValues: { ...EMPTY_FORM },
  });

  const loadLanguages = useCallback(async () => {
    try {
      const data = await getLanguages();
      setLanguages(data);
    } catch {
      /* List is non-critical — keep the form usable on failure */
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getLanguages()
      .then((data) => {
        if (active) setLanguages(data);
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
    (language: Language) => {
      setEditingId(language.id);
      setSuccess("");
      setDeleteConfirmId(null);
      clearErrors("root");

      reset({
        language: language.language,
        level: language.level,
      });
    },
    [reset, clearErrors],
  );

  const onSubmit = async (data: LanguageFormData) => {
    setSuccess("");
    setError("root", {});

    const language = data.language.trim();

    const isDuplicate = languages.some(
      (item) =>
        item.id !== editingId &&
        item.language.trim().toLowerCase() === language.toLowerCase(),
    );

    if (isDuplicate) {
      setError("language", {
        type: "validate",
        message: "This language is already in your list.",
      });
      return;
    }

    const payload = {
      language,
      level: data.level,
    };

    try {
      if (editingId) {
        await updateLanguage(editingId, payload);
        setSuccess("Language updated successfully.");
      } else {
        await createLanguage(payload);
        setSuccess("Language added successfully.");
      }

      resetForm();
      await loadLanguages();
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
        await deleteLanguage(id);

        if (editingId === id) {
          resetForm();
        }

        setSuccess("Language deleted.");
        await loadLanguages();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const serverMessage = error.response?.data?.message;
          setError("root", {
            type: "server",
            message:
              typeof serverMessage === "string"
                ? serverMessage
                : "Failed to delete language.",
          });
          return;
        }

        setError("root", {
          type: "server",
          message: "Failed to delete language.",
        });
      }
    },
    [editingId, resetForm, loadLanguages, setError],
  );

  return (
    <div className="w-full max-w-2xl rounded border p-6 shadow">
      <h1 className="mb-1 text-2xl font-bold">
        {editingId ? "Edit Language" : "Languages"}
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        {editingId
          ? "Update your language details."
          : "Add languages you speak."}
      </p>

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Language Name */}
        <div>
          <label htmlFor="language" className="mb-1 block text-sm font-medium">
            Language <span className="text-red-500">*</span>
          </label>
          <input
            id="language"
            type="text"
            placeholder="e.g. Arabic"
            autoComplete="off"
            maxLength={100}
            disabled={isSubmitting}
            {...register("language")}
            className="w-full rounded border p-2 disabled:opacity-50"
          />
          {errors.language && (
            <p className="mt-1 text-sm text-red-500">
              {errors.language.message}
            </p>
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
            {LANGUAGE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {LANGUAGE_LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>
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
                ? "Update Language"
                : "Add Language"}
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

      {/* ─── Language List ─── */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Your Languages</h2>

        {isLoadingList ? (
          <p className="text-sm text-gray-500">Loading languages...</p>
        ) : languages.length === 0 ? (
          <p className="text-sm text-gray-500">
            No languages added yet. Fill the form above to get started.
          </p>
        ) : (
          <ul className="space-y-2">
            {languages.map((item) => (
              <li
                key={item.id}
                className="rounded border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{item.language}</h3>
                    <p className="text-xs text-gray-400">
                      {LANGUAGE_LEVEL_LABELS[item.level]}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      disabled={isSubmitting}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
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
                        onClick={() => setDeleteConfirmId(item.id)}
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
