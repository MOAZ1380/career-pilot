"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getCertificates } from "@/services/certificate/api/certificate.service";
import { getEducations } from "@/services/education/api/education.service";
import { getExperiences } from "@/services/experience/api/experience.service";
import { getLanguages } from "@/services/language/api/language.service";
import { getProjects } from "@/services/project/api/project.service";
import { getSkills } from "@/services/skill/api/skill.service";

import { resumeSchema, type ResumeFormData } from "../schemas/resume.schema";

import type { Resume, CreateResumeDto } from "../types/resume";

import {
  createResume,
  deleteResume,
  getResumes,
  updateResume,
} from "../api/resume.service";

import ResumeList from "./ResumeList";

interface SkillOption {
  id: string;
  name: string;
}

interface ExperienceOption {
  id: string;
  jobTitle: string;
  company: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface EducationOption {
  id: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  institution?: string | null;
}

interface CertificateOption {
  id: string;
  name?: string | null;
  issuer?: string | null;
}

interface LanguageOption {
  id: string;
  name: string;
  level?: string | null;
}

const emptyForm: ResumeFormData = {
  title: "",
  template: "MODERN",
  jobDescription: "",
  generatedSummary: "",

  skillIds: [],
  experienceIds: [],
  educationIds: [],
  projectIds: [],
  certificateIds: [],
  languageIds: [],

  experienceDescriptions: {},
  projectDescriptions: {},
};

export default function ResumeForm() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [experiences, setExperiences] = useState<ExperienceOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [educations, setEducations] = useState<EducationOption[]>([]);
  const [certificates, setCertificates] = useState<CertificateOption[]>([]);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    mode: "onBlur",
    defaultValues: emptyForm,
  });

  const selectedExperienceIds = watch("experienceIds");
  const selectedProjectIds = watch("projectIds");

  const loadResumeData = async () => {
    try {
      const [
        resumesData,
        skillsData,
        experiencesData,
        projectsData,
        educationsData,
        certificatesData,
        languagesData,
      ] = await Promise.all([
        getResumes(),
        getSkills(),
        getExperiences(),
        getProjects(),
        getEducations(),
        getCertificates(),
        getLanguages(),
      ]);

      setResumes(resumesData);
      setSkills(skillsData);
      setExperiences(experiencesData);
      setProjects(projectsData);
      setEducations(educationsData);
      setCertificates(certificatesData);
      setLanguages(languagesData);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError("root", {
          type: "server",
          message:
            typeof message === "string"
              ? message
              : "Failed to load resume data.",
        });

        return;
      }

      setError("root", {
        type: "server",
        message: "Failed to load resume data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await getResumes();

      setResumes(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError("root", {
          type: "server",
          message:
            typeof message === "string" ? message : "Failed to load resumes.",
        });

        return;
      }

      setError("root", {
        type: "server",
        message: "Failed to load resumes.",
      });
    }
  };

  const handleEdit = (resume: Resume) => {
    setSuccess("");
    setError("root", {});

    setEditingResumeId(resume.id);

    const experienceDescriptions: Record<string, string[]> = {};

    resume.experiences.forEach((item) => {
      experienceDescriptions[item.experienceId] = item.customDescription ?? [];
    });

    const projectDescriptions: Record<string, string> = {};

    resume.projects.forEach((item) => {
      projectDescriptions[item.projectId] = item.customizedDescription ?? "";
    });

    reset({
      title: resume.title,
      template: resume.template,
      jobDescription: resume.jobDescription ?? "",
      generatedSummary: resume.generatedSummary ?? "",

      skillIds: resume.skills.map((item) => item.skillId),
      experienceIds: resume.experiences.map((item) => item.experienceId),
      educationIds: resume.educations.map((item) => item.educationId),
      projectIds: resume.projects.map((item) => item.projectId),
      certificateIds: resume.certificates.map((item) => item.certificateId),
      languageIds: resume.languages.map((item) => item.languageId),

      experienceDescriptions,
      projectDescriptions,
    });
  };

  const handleCancelEdit = () => {
    setEditingResumeId(null);
    setSuccess("");
    setError("root", {});

    reset(emptyForm);
  };

  const onSubmit = async (data: ResumeFormData) => {
    setSuccess("");
    setError("root", {});

    const cleanedData: CreateResumeDto = {
      title: data.title.trim(),
      template: data.template,

      jobDescription: data.jobDescription.trim() || undefined,
      generatedSummary: data.generatedSummary.trim() || undefined,

      skillIds: data.skillIds,
      experienceIds: data.experienceIds,
      educationIds: data.educationIds,
      projectIds: data.projectIds,
      certificateIds: data.certificateIds,
      languageIds: data.languageIds,

      experienceDescriptions: data.experienceDescriptions,
      projectDescriptions: data.projectDescriptions,
    };

    try {
      if (editingResumeId) {
        await updateResume(editingResumeId, cleanedData);

        setSuccess("Resume updated successfully.");
        setEditingResumeId(null);
      } else {
        await createResume(cleanedData);

        setSuccess("Resume created successfully.");
      }

      reset(emptyForm);

      await loadResumes();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError("root", {
          type: "server",
          message:
            typeof message === "string"
              ? message
              : "Something went wrong. Please try again.",
        });

        return;
      }

      setError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    setSuccess("");
    setError("root", {});

    try {
      await deleteResume(id);

      setResumes((current) => current.filter((resume) => resume.id !== id));

      if (editingResumeId === id) {
        setEditingResumeId(null);
        reset(emptyForm);
      }

      setSuccess("Resume deleted successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError("root", {
          type: "server",
          message:
            typeof message === "string" ? message : "Failed to delete resume.",
        });

        return;
      }

      setError("root", {
        type: "server",
        message: "Failed to delete resume.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl rounded border p-6 shadow">
        <p className="text-sm text-gray-600">Loading resume data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-8">
      <ResumeList
        resumes={resumes}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded border p-6 shadow"
        noValidate
      >
        <div>
          <h2 className="text-xl font-bold">
            {editingResumeId ? "Edit Resume" : "Create Resume"}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {editingResumeId
              ? "Update your resume information."
              : "Create a resume from your profile data."}
          </p>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Resume Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="e.g. Backend Developer Resume"
            disabled={isSubmitting}
            {...register("title")}
            className="w-full rounded border p-2"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Template */}
        <div>
          <label htmlFor="template" className="mb-1 block text-sm font-medium">
            Template
          </label>

          <select
            id="template"
            disabled={isSubmitting}
            {...register("template")}
            className="w-full rounded border p-2"
          >
            <option value="MODERN">Modern</option>
            <option value="CLASSIC">Classic</option>
            <option value="MINIMAL">Minimal</option>
          </select>

          {errors.template && (
            <p className="mt-1 text-sm text-red-500">
              {errors.template.message}
            </p>
          )}
        </div>

        {/* Job Description */}
        <div>
          <label
            htmlFor="jobDescription"
            className="mb-1 block text-sm font-medium"
          >
            Job Description
          </label>

          <textarea
            id="jobDescription"
            rows={6}
            placeholder="Paste the job description here..."
            disabled={isSubmitting}
            {...register("jobDescription")}
            className="w-full rounded border p-2"
          />

          {errors.jobDescription && (
            <p className="mt-1 text-sm text-red-500">
              {errors.jobDescription.message}
            </p>
          )}
        </div>

        {/* Generated Summary */}
        <div>
          <label
            htmlFor="generatedSummary"
            className="mb-1 block text-sm font-medium"
          >
            Summary
          </label>

          <textarea
            id="generatedSummary"
            rows={5}
            placeholder="Professional summary..."
            disabled={isSubmitting}
            {...register("generatedSummary")}
            className="w-full rounded border p-2"
          />

          {errors.generatedSummary && (
            <p className="mt-1 text-sm text-red-500">
              {errors.generatedSummary.message}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <h3 className="mb-2 text-sm font-medium">Skills</h3>

          <div className="space-y-2">
            {skills.map((skill) => (
              <label key={skill.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={skill.id}
                  disabled={isSubmitting}
                  {...register("skillIds")}
                />

                <span>{skill.name}</span>
              </label>
            ))}
          </div>

          {errors.skillIds && (
            <p className="mt-1 text-sm text-red-500">
              {errors.skillIds.message}
            </p>
          )}
        </div>

        {/* Experiences */}
        <div>
          <h3 className="mb-2 text-sm font-medium">Experiences</h3>

          <div className="space-y-4">
            {experiences.map((experience) => {
              const selected = selectedExperienceIds.includes(experience.id);

              return (
                <div key={experience.id} className="rounded border p-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      value={experience.id}
                      disabled={isSubmitting}
                      {...register("experienceIds")}
                    />

                    <span>
                      {experience.jobTitle} - {experience.company}
                    </span>
                  </label>

                  {selected && (
                    <div className="mt-3">
                      <label className="mb-1 block text-xs font-medium">
                        Customized Description
                      </label>

                      <textarea
                        rows={4}
                        disabled={isSubmitting}
                        placeholder="Add customized bullet points..."
                        {...register(
                          `experienceDescriptions.${experience.id}.0`,
                        )}
                        className="w-full rounded border p-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {errors.experienceIds && (
            <p className="mt-1 text-sm text-red-500">
              {errors.experienceIds.message}
            </p>
          )}
        </div>

        {/* Projects */}
        <div>
          <h3 className="mb-2 text-sm font-medium">Projects</h3>

          <div className="space-y-4">
            {projects.map((project) => {
              const selected = selectedProjectIds.includes(project.id);

              return (
                <div key={project.id} className="rounded border p-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      value={project.id}
                      disabled={isSubmitting}
                      {...register("projectIds")}
                    />

                    <span>{project.name}</span>
                  </label>

                  {selected && (
                    <div className="mt-3">
                      <label className="mb-1 block text-xs font-medium">
                        Customized Description
                      </label>

                      <textarea
                        rows={4}
                        disabled={isSubmitting}
                        placeholder="Customize this project's description..."
                        {...register(`projectDescriptions.${project.id}`)}
                        className="w-full rounded border p-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {errors.projectIds && (
            <p className="mt-1 text-sm text-red-500">
              {errors.projectIds.message}
            </p>
          )}
        </div>

        {/* Educations */}
        <div>
          <h3 className="mb-2 text-sm font-medium">Education</h3>

          <div className="space-y-2">
            {educations.map((education) => (
              <label
                key={education.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  value={education.id}
                  disabled={isSubmitting}
                  {...register("educationIds")}
                />

                <span>
                  {education.degree ?? "Education"}
                  {education.fieldOfStudy ? ` - ${education.fieldOfStudy}` : ""}
                  {education.institution ? ` (${education.institution})` : ""}
                </span>
              </label>
            ))}
          </div>

          {errors.educationIds && (
            <p className="mt-1 text-sm text-red-500">
              {errors.educationIds.message}
            </p>
          )}
        </div>

        {/* Certificates */}
        <div>
          <h3 className="mb-2 text-sm font-medium">Certificates</h3>

          <div className="space-y-2">
            {certificates.map((certificate) => (
              <label
                key={certificate.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  value={certificate.id}
                  disabled={isSubmitting}
                  {...register("certificateIds")}
                />

                <span>
                  {certificate.name ?? "Certificate"}
                  {certificate.issuer ? ` - ${certificate.issuer}` : ""}
                </span>
              </label>
            ))}
          </div>

          {errors.certificateIds && (
            <p className="mt-1 text-sm text-red-500">
              {errors.certificateIds.message}
            </p>
          )}
        </div>

        {/* Languages */}
        <div>
          <h3 className="mb-2 text-sm font-medium">Languages</h3>

          <div className="space-y-2">
            {languages.map((language) => (
              <label
                key={language.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  value={language.id}
                  disabled={isSubmitting}
                  {...register("languageIds")}
                />

                <span>
                  {language.name}
                  {language.level ? ` - ${language.level}` : ""}
                </span>
              </label>
            ))}
          </div>

          {errors.languageIds && (
            <p className="mt-1 text-sm text-red-500">
              {errors.languageIds.message}
            </p>
          )}
        </div>

        {/* Server Error */}
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        {/* Success */}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded bg-black p-2 text-white disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : editingResumeId
                ? "Update Resume"
                : "Create Resume"}
          </button>

          {editingResumeId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="rounded border px-5 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
