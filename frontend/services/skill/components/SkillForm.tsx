"use client";

import { useState } from "react";
import { createSkill } from "../api/skill.service";
import { CreateSkillDto, SkillLevel } from "../types/skill";

const initialState: CreateSkillDto = {
  name: "",
  level: "BEGINNER",
  yearsOfExperience: 0,
};

export default function SkillForm() {
  const [form, setForm] = useState<CreateSkillDto>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSkill(form);

      alert("Skill created successfully!");

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
      <h2 className="text-2xl font-bold">Skill</h2>

      <input
        name="name"
        placeholder="Skill Name"
        value={form.name}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <select
        name="level"
        value={form.level}
        onChange={handleChange}
        className="rounded border p-2"
      >
        {(
          ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as SkillLevel[]
        ).map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="yearsOfExperience"
        min={0}
        value={form.yearsOfExperience}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <button type="submit" className="rounded bg-black p-2 text-white">
        Save
      </button>
    </form>
  );
}
