"use client";

import { useState } from "react";
import { createResume } from "../api/resume.service";
import { CreateResumeDto, ResumeTemplate } from "../types/resume";

const initialState: CreateResumeDto = {
  title: "",
  template: "MODERN",

  jobDescription: "",
  generatedSummary: "",

  skillIds: [],
  experienceIds: [],
  projectIds: [],
  certificateIds: [],
  languageIds: [],
};

export default function ResumeForm() {
  const [form, setForm] = useState<CreateResumeDto>(initialState);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    const arrayFields = [
      "skillIds",
      "experienceIds",
      "projectIds",
      "certificateIds",
      "languageIds",
    ];

    if (arrayFields.includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      jobDescription: form.jobDescription || undefined,
      generatedSummary: form.generatedSummary || undefined,
    };

    try {
      await createResume(payload);

      alert("Resume created successfully!");

      setForm(initialState);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border p-6"
    >
      <h2 className="text-2xl font-bold">Resume</h2>

      <input
        name="title"
        placeholder="Resume Title"
        value={form.title}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <select
        name="template"
        value={form.template}
        onChange={handleChange}
        className="rounded border p-2"
      >
        {(["MODERN", "CLASSIC", "MINIMAL"] as ResumeTemplate[]).map(
          (template) => (
            <option key={template} value={template}>
              {template}
            </option>
          ),
        )}
      </select>

      <textarea
        name="jobDescription"
        placeholder="Job Description"
        value={form.jobDescription ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <textarea
        name="generatedSummary"
        placeholder="Generated Summary"
        value={form.generatedSummary ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="skillIds"
        placeholder="Skill IDs (comma separated)"
        value={form.skillIds.join(", ")}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="experienceIds"
        placeholder="Experience IDs"
        value={form.experienceIds.join(", ")}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="projectIds"
        placeholder="Project IDs"
        value={form.projectIds.join(", ")}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="certificateIds"
        placeholder="Certificate IDs"
        value={form.certificateIds.join(", ")}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="languageIds"
        placeholder="Language IDs"
        value={form.languageIds.join(", ")}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <button type="submit" className="rounded bg-black p-2 text-white">
        Save
      </button>
    </form>
  );
}
