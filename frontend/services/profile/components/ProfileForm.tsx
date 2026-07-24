"use client";

import { useState } from "react";
import { CreateProfileDto } from "../types/profile";
import { createProfile } from "../api/profile.service";

const initialState: CreateProfileDto = {
  firstName: "",
  lastName: "",
  headline: "",
  bio: "",
  image: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState<CreateProfileDto>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      headline: form.headline || undefined,
      bio: form.bio || undefined,
      image: form.image || undefined,
    };

    try {
      await createProfile(payload);
      alert("Profile created successfully");
      setForm(initialState);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border p-6"
    >
      <h2 className="text-2xl font-bold">Profile</h2>

      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        name="headline"
        placeholder="Headline"
        value={form.headline ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <textarea
        name="bio"
        placeholder="Bio"
        value={form.bio ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="url"
        name="image"
        placeholder="Image URL"
        value={form.image ?? ""}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <button type="submit" className="rounded bg-black p-2 text-white">
        Save
      </button>
    </form>
  );
}
