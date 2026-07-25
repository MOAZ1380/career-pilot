"use client";

import { useEffect, useState } from "react";
import { createResume } from "../api/resume.service";
import { CreateResumeDto, ResumeTemplate } from "../types/resume";
import { getProfile } from "@/services/profile/api/profile.service";
import { info } from "console";
import { Certificate } from "crypto";

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

const initialProfile = {
  contactInfo: null,
  skills: [],
  experiences: [],
  projects: [],
  educations: [],
  certificates: [],
  languages: [],
};

export default function ResumeForm() {
  const [form, setForm] = useState<CreateResumeDto>(initialState);
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile();
      setProfile(data);
    };

    loadProfile();
  }, []);
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

      <label>Skills</label>

      {profile.skills.map((skill) => (
        <label key={skill.id} className="flex gap-2">
          <input
            type="checkbox"
            checked={form.skillIds.includes(skill.id)}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                skillIds: e.target.checked
                  ? [...prev.skillIds, skill.id]
                  : prev.skillIds.filter((id) => id !== skill.id),
              }));
            }}
          />

          {skill.name}
        </label>
      ))}

      <label>Experiences</label>
      {profile.experiences.map((exp) => (
        <label key={exp.id} className="flex gap-2">
          <input
            type="checkbox"
            checked={form.experienceIds.includes(exp.id)}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                experienceIds: e.target.checked
                  ? [...prev.experienceIds, exp.id]
                  : prev.experienceIds.filter((id) => id !== exp.id),
              }));
            }}
          />
          {exp.position} - {exp.company}
        </label>
      ))}

      <label>Projects</label>
      {profile.projects.map((project) => (
        <label key={project.id} className="flex gap-2">
          <input
            type="checkbox"
            checked={form.projectIds.includes(project.id)}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                projectIds: e.target.checked
                  ? [...prev.projectIds, project.id]
                  : prev.projectIds.filter((id) => id !== project.id),
              }));
            }}
          />
          {project.name}
        </label>
      ))}

      <label>Certificates</label>
      {profile.certificates.map((certificate) => (
        <label key={certificate.id} className="flex gap-2">
          <input
            type="checkbox"
            checked={form.certificateIds.includes(certificate.id)}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                certificateIds: e.target.checked
                  ? [...prev.certificateIds, certificate.id]
                  : prev.certificateIds.filter((id) => id !== certificate.id),
              }));
            }}
          />
          {certificate.name}
        </label>
      ))}

      <label>Languages</label>
      {profile.languages.map((language) => (
        <label key={language.id} className="flex gap-2">
          <input
            type="checkbox"
            checked={form.languageIds.includes(language.id)}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                languageIds: e.target.checked
                  ? [...prev.languageIds, language.id]
                  : prev.languageIds.filter((id) => id !== language.id),
              }));
            }}
          />
          {language.language}
        </label>
      ))}

      <button type="submit" className="rounded bg-black p-2 text-white">
        Save
      </button>
    </form>
  );
}
