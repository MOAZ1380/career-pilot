"use client";

import { useState } from "react";
import { CreateCertificateDto } from "../types/certificate";
import { createCertificate } from "../api/certificate.service";

const initialState: CreateCertificateDto = {
  name: "",
  issuer: "",
  issueDate: "",
  expirationDate: "",
  credentialId: "",
  credentialUrl: "",
};
export default function CertificateForm() {
  const [form, setForm] = useState<CreateCertificateDto>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...form,
      expirationDate: form.expirationDate || undefined,
      credentialId: form.credentialId || undefined,
      credentialUrl: form.credentialUrl || undefined,
    };

    try {
      console.log(form);
      await createCertificate(data);

      alert("Certificate created successfully!");
      setForm(initialState);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-xl flex-col gap-4 rounded-lg border p-6"
    >
      <h2 className="text-2xl font-bold">Add Certificate</h2>

      <input
        type="text"
        name="name"
        placeholder="Certificate Name"
        value={form.name}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="text"
        name="issuer"
        placeholder="Issuer"
        value={form.issuer}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="date"
        name="issueDate"
        value={form.issueDate}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="date"
        name="expirationDate"
        value={form.expirationDate}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="text"
        name="credentialId"
        placeholder="Credential ID"
        value={form.credentialId}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <input
        type="url"
        name="credentialUrl"
        placeholder="Credential URL"
        value={form.credentialUrl}
        onChange={handleChange}
        className="rounded border p-2"
      />

      <button type="submit" className="rounded bg-black p-2 text-white">
        Save Certificate
      </button>
    </form>
  );
}
