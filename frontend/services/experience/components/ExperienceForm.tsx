"use client";

import { useState } from "react";
import {
  CreateExperienceDto,
  Experience,
  EmploymentType,
} from "../types/experience";
import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
} from "../api/experience.service";

const initialState: CreateExperienceDto = {
  company: "",
  position: "",
  employmentType: "FULL_TIME",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: [],
  technologies: [],
};

export default function ExperienceForm() {
  const [form, setForm] = useState<CreateExperienceDto>(initialState);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value === ""
            ? undefined
            : value,
    }));
  };

  const handleCreate = async () => {
    try {
      const data = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate
          ? new Date(form.endDate).toISOString()
          : undefined,
        description: description
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        technologies: technologies
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      await createExperience(data);
      alert("Created Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGet = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate
          ? new Date(form.endDate).toISOString()
          : undefined,
        description: description
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        technologies: technologies
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      await updateExperience(data);
      alert("Updated Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExperience();
      setExperiences([]);
      setForm(initialState);
      alert("Deleted Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-2xl font-bold">Experience</h2>

      <input
        className="rounded border p-2"
        placeholder="Company"
        name="company"
        value={form.company}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        placeholder="Position"
        name="position"
        value={form.position}
        onChange={handleChange}
      />

      <select
        className="rounded border p-2"
        name="employmentType"
        value={form.employmentType}
        onChange={handleChange}
      >
        {(
          [
            "FULL_TIME",
            "PART_TIME",
            "CONTRACT",
            "INTERNSHIP",
          ] as EmploymentType[]
        ).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <input
        className="rounded border p-2"
        placeholder="Location"
        name="location"
        value={form.location ?? ""}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        type="date"
        name="endDate"
        value={form.endDate ?? ""}
        onChange={handleChange}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="currentlyWorking"
          checked={form.currentlyWorking}
          onChange={handleChange}
        />
        Currently Working
      </label>

      <input
        className="rounded border p-2"
        placeholder="Description (comma separated)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="rounded border p-2"
        placeholder="Technologies (comma separated)"
        value={technologies}
        onChange={(e) => setTechnologies(e.target.value)}
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

      {experiences.length > 0 && (
        <pre className="rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(experiences, null, 2)}
        </pre>
      )}
    </div>
  );
}
