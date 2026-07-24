"use client";

import { useState } from "react";
import { CreateLanguageDto, Language, LanguageLevel } from "../types/language";
import {
  createLanguage,
  deleteLanguage,
  getLanguages,
  updateLanguage,
} from "../api/language.service";

const initialState: CreateLanguageDto = {
  language: "",
  level: "BASIC",
};

export default function LanguageForm() {
  const [form, setForm] = useState<CreateLanguageDto>(initialState);
  const [languages, setLanguages] = useState<Language[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    try {
      const data = await createLanguage(form);
      console.log(data);
      alert("Language created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGet = async () => {
    try {
      const data = await getLanguages();
      setLanguages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = await updateLanguage(form);
      console.log(data);
      alert("Updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLanguage();
      setLanguages([]);
      setForm(initialState);
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-2xl font-bold">Language</h2>

      <input
        className="rounded border p-2"
        name="language"
        placeholder="Language"
        value={form.language}
        onChange={handleChange}
      />

      <select
        className="rounded border p-2"
        name="level"
        value={form.level}
        onChange={handleChange}
      >
        {(
          [
            "BASIC",
            "CONVERSATIONAL",
            "PROFESSIONAL",
            "NATIVE",
          ] as LanguageLevel[]
        ).map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Create
        </button>

        <button
          onClick={handleGet}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Get
        </button>

        <button
          onClick={handleUpdate}
          className="rounded bg-yellow-500 px-4 py-2 text-white"
        >
          Update
        </button>

        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Delete
        </button>
      </div>

      {languages.length > 0 && (
        <pre className="rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(languages, null, 2)}
        </pre>
      )}
    </div>
  );
}
