"use client";

import type { Resume } from "../types/resume";

interface ResumeListProps {
  resumes: Resume[];
  isLoading: boolean;
  isSubmitting: boolean;
  onEdit: (resume: Resume) => void;
  onDelete: (id: string) => void;
}

export default function ResumeList({
  resumes,
  isLoading,
  isSubmitting,
  onEdit,
  onDelete,
}: ResumeListProps) {
  if (isLoading) {
    return (
      <div className="rounded border p-6">
        <p className="text-sm text-gray-600">Loading resumes...</p>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded border p-6">
        <p className="text-sm text-gray-600">You don't have any resumes yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Resumes</h2>

      {resumes.map((resume) => (
        <div key={resume.id} className="space-y-4 rounded border p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{resume.title}</h3>

              <p className="mt-1 text-sm text-gray-600">
                Template: {resume.template}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onEdit(resume)}
                disabled={isSubmitting}
                className="text-sm text-blue-600 hover:underline disabled:opacity-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(resume.id)}
                disabled={isSubmitting}
                className="text-sm text-red-500 hover:underline disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>

          {resume.generatedSummary && (
            <div>
              <p className="text-sm font-medium">Summary</p>

              <p className="mt-1 text-sm text-gray-600">
                {resume.generatedSummary}
              </p>
            </div>
          )}

          {resume.jobDescription && (
            <div>
              <p className="text-sm font-medium">Job Description</p>

              <p className="mt-1 line-clamp-3 text-sm text-gray-600">
                {resume.jobDescription}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="rounded bg-gray-100 px-2 py-1">
              {resume.skills.length} Skills
            </span>

            <span className="rounded bg-gray-100 px-2 py-1">
              {resume.experiences.length} Experiences
            </span>

            <span className="rounded bg-gray-100 px-2 py-1">
              {resume.projects.length} Projects
            </span>

            <span className="rounded bg-gray-100 px-2 py-1">
              {resume.educations.length} Educations
            </span>

            <span className="rounded bg-gray-100 px-2 py-1">
              {resume.certificates.length} Certificates
            </span>

            <span className="rounded bg-gray-100 px-2 py-1">
              {resume.languages.length} Languages
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
