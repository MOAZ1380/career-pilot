"use client";

import { useState } from "react";
import { createProject } from "../api/project.service";
import { CreateProjectDto } from "../types/project";

const initialState: CreateProjectDto = {
  name: "",
  description: "",
  github: "",
  liveDemo: "",
  technologies: [],
  startDate: "",
  endDate: "",
};

export default function ProjectForm() {
  const [form, setForm] = useState<CreateProjectDto>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "technologies") {
      setForm((prev) => ({
        ...prev,
        technologies: value
          .split(",")
          .map((tech) => tech.trim())
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
      github: form.github || undefined,
      liveDemo: form.liveDemo || undefined,
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
    };

    try {
      await createProject(payload);
      alert("Project created successfully!");
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
      <h2 className="text-2xl font-bold">Project</h2>

      <input
        name="name"
        placeholder="Project Name"
        value={form.name}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="url"
        name="github"
        placeholder="Github URL"
        value={form.github ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="url"
        name="liveDemo"
        placeholder="Live Demo URL"
        value={form.liveDemo ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="technologies"
        placeholder="React, Next.js, NestJS"
        value={form.technologies.join(", ")}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="date"
        name="startDate"
        value={form.startDate ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="date"
        name="endDate"
        value={form.endDate ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <button type="submit" className="rounded bg-black p-2 text-white">
        Save
      </button>
    </form>
  );
}
