"use client";

import { useState } from "react";
import { CreateContactInfoDto, ContactInfo } from "../types/contact-info";
import {
  createContactInfo,
  getContactInfo,
  updateContactInfo,
  deleteContactInfo,
} from "../api/contact-info.api";

const initialState: CreateContactInfoDto = {
  phone: "",
  linkedIn: "",
  github: "",
  portfolio: "",
  country: "",
  city: "",
};

export default function ContactInfoForm() {
  const [form, setForm] = useState<CreateContactInfoDto>(initialState);
  const [contact, setContact] = useState<ContactInfo | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    try {
      const data = await createContactInfo(form);
      setContact(data);
      alert("Created Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGet = async () => {
    try {
      const data = await getContactInfo();
      setContact(data);
      setForm({
        phone: data.phone ?? "",
        linkedIn: data.linkedIn ?? "",
        github: data.github ?? "",
        portfolio: data.portfolio ?? "",
        country: data.country ?? "",
        city: data.city ?? "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = await updateContactInfo(form);
      setContact(data);
      alert("Updated Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContactInfo();
      setContact(null);
      setForm(initialState);
      alert("Deleted Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-2xl font-bold">Contact Information</h2>

      <input
        className="rounded border p-2"
        name="phone"
        placeholder="Phone"
        value={form.phone ?? ""}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        name="linkedIn"
        placeholder="LinkedIn URL"
        value={form.linkedIn ?? ""}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        name="github"
        placeholder="GitHub URL"
        value={form.github ?? ""}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        name="portfolio"
        placeholder="Portfolio URL"
        value={form.portfolio ?? ""}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        name="country"
        placeholder="Country"
        value={form.country ?? ""}
        onChange={handleChange}
      />

      <input
        className="rounded border p-2"
        name="city"
        placeholder="City"
        value={form.city ?? ""}
        onChange={handleChange}
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

      {contact && (
        <pre className="rounded bg-gray-100 p-3 text-sm">
          {JSON.stringify(contact, null, 2)}
        </pre>
      )}
    </div>
  );
}
