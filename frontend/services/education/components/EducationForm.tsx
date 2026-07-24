"use client";

import { useState } from "react";
import { CreateEducationDto, Education } from "../types/education";
import {
  createEducation,
  deleteEducation,
  getEducations,
  updateEducation,
} from "../api/education.service";

const initialState: CreateEducationDto = {
  university: "",
  degree: "",
  field: "",
  grade: "",
  startDate: "",
  endDate: "",
};

export default function EducationForm() {
  const [form, setForm] = useState<CreateEducationDto>(initialState);
  const [educations, setEducations] = useState<Education[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value === "" ? undefined : e.target.value,
    }));
  };

  const handleCreate = async () => {
    try {
      const data = await createEducation(form);
      alert("Education created successfully");
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGet = async () => {
    try {
      const data = await getEducations();
      setEducations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = await updateEducation(form);
      alert("Updated successfully");
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEducation();
      setEducations([]);
      setForm(initialState);
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-2xl font-bold">Education</h2>

      <input
        name="university"
        placeholder="University"
        value={form.university}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="degree"
        placeholder="Degree"
        value={form.degree}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="field"
        placeholder="Field of Study"
        value={form.field}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="grade"
        placeholder="Grade"
        value={form.grade ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="date"
        name="startDate"
        value={form.startDate}
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

      {educations.length > 0 && (
        <pre className="rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(educations, null, 2)}
        </pre>
      )}
    </div>
  );
}
