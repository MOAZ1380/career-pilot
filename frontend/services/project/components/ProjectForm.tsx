"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema, type ProjectFormData } from "../schemas/project.schema";

import type { Project } from "../types/project";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../api/project.service";

const emptyProjectForm: ProjectFormData = {
  name: "",
  description: "",
  github: "",
  liveDemo: "",
  technologies: [],
  startDate: "",
  endDate: "",
};

export default function ProjectForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [success, setSuccess] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onBlur",
    defaultValues: emptyProjectForm,
  });

  const {
    fields: technologyFields,
    append: appendTechnology,
    remove: removeTechnology,
  } = useFieldArray({
    control,
    name: "technologies",
  });

  const loadProjects = async () => {
    try {
      const data = await getProjects();

      setProjects(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError("root", {
          type: "server",
          message:
            typeof message === "string" ? message : "Failed to load projects.",
        });

        return;
      }

      setError("root", {
        type: "server",
        message: "Failed to load projects.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setSuccess("");
    setError("root", {});

    setEditingProjectId(project.id);

    reset({
      name: project.name,
      description: project.description,
      github: project.github ?? "",
      liveDemo: project.liveDemo ?? "",
      technologies: project.technologies ?? [],
      startDate: project.startDate ?? "",
      endDate: project.endDate ?? "",
    });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setSuccess("");
    setError("root", {});

    reset(emptyProjectForm);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setSuccess("");
    setError("root", {});

    const cleanedData = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
      github: data.github?.trim() || undefined,
      liveDemo: data.liveDemo?.trim() || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      technologies: data.technologies
        .map((technology) => technology.trim())
        .filter(Boolean),
    };

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, cleanedData);

        setSuccess("Project updated successfully.");
        setEditingProjectId(null);
      } else {
        await createProject(cleanedData);

        setSuccess("Project created successfully.");
      }

      reset(emptyProjectForm);

      await loadProjects();
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
      await deleteProject(id);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id),
      );

      if (editingProjectId === id) {
        setEditingProjectId(null);
        reset(emptyProjectForm);
      }

      setSuccess("Project deleted successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError("root", {
          type: "server",
          message:
            typeof message === "string" ? message : "Failed to delete project.",
        });

        return;
      }

      setError("root", {
        type: "server",
        message: "Failed to delete project.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl rounded border p-6 shadow">
        <p className="text-sm text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8 rounded border p-6 shadow">
      <div>
        <h1 className="mb-2 text-2xl font-bold">Projects</h1>

        <p className="text-sm text-gray-600">
          Add your projects and the technologies you used in them.
        </p>
      </div>

      {/* Existing Projects */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Projects</h2>

          {projects.map((project) => (
            <div key={project.id} className="space-y-3 rounded border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {project.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    disabled={isSubmitting}
                    className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    disabled={isSubmitting}
                    className="text-sm text-red-500 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded bg-gray-100 px-2 py-1 text-xs"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-1 text-sm">
                {project.github && (
                  <p>
                    <span className="font-medium">GitHub:</span>{" "}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {project.github}
                    </a>
                  </p>
                )}

                {project.liveDemo && (
                  <p>
                    <span className="font-medium">Live Demo:</span>{" "}
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {project.liveDemo}
                    </a>
                  </p>
                )}
              </div>

              {(project.startDate || project.endDate) && (
                <p className="text-sm text-gray-600">
                  {project.startDate ?? "Start date"}{" "}
                  {project.endDate ? `- ${project.endDate}` : "- Present"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <h2 className="text-lg font-semibold">
            {editingProjectId ? "Edit Project" : "Add Project"}
          </h2>

          <p className="text-sm text-gray-600">
            {editingProjectId
              ? "Update the project information."
              : "Add a project that you want to include in your CV."}
          </p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Project Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="e.g. CareerPilot"
            disabled={isSubmitting}
            {...register("name")}
            className="w-full rounded border p-2"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={5}
            placeholder="Describe what the project does..."
            disabled={isSubmitting}
            {...register("description")}
            className="w-full rounded border p-2"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <label htmlFor="github" className="mb-1 block text-sm font-medium">
            GitHub
          </label>

          <input
            id="github"
            type="url"
            placeholder="https://github.com/username/project"
            disabled={isSubmitting}
            {...register("github")}
            className="w-full rounded border p-2"
          />

          {errors.github && (
            <p className="mt-1 text-sm text-red-500">{errors.github.message}</p>
          )}
        </div>

        {/* Live Demo */}
        <div>
          <label htmlFor="liveDemo" className="mb-1 block text-sm font-medium">
            Live Demo
          </label>

          <input
            id="liveDemo"
            type="url"
            placeholder="https://example.com"
            disabled={isSubmitting}
            {...register("liveDemo")}
            className="w-full rounded border p-2"
          />

          {errors.liveDemo && (
            <p className="mt-1 text-sm text-red-500">
              {errors.liveDemo.message}
            </p>
          )}
        </div>

        {/* Technologies */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Technologies</h3>

            <p className="text-sm text-gray-600">
              Add the technologies you used in this project.
            </p>
          </div>

          {technologyFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. NestJS"
                  disabled={isSubmitting}
                  {...register(`technologies.${index}`)}
                  className="w-full rounded border p-2"
                />

                {errors.technologies?.[index] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.technologies[index]?.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeTechnology(index)}
                disabled={isSubmitting}
                className="rounded border px-3 py-2 text-sm text-red-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}

          {typeof errors.technologies?.message === "string" && (
            <p className="text-sm text-red-500">
              {errors.technologies.message}
            </p>
          )}

          <button
            type="button"
            onClick={() => appendTechnology("")}
            disabled={isSubmitting}
            className="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            + Add Technology
          </button>
        </div>

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="mb-1 block text-sm font-medium"
            >
              Start Date
            </label>

            <input
              id="startDate"
              type="date"
              disabled={isSubmitting}
              {...register("startDate")}
              className="w-full rounded border p-2"
            />

            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="mb-1 block text-sm font-medium">
              End Date
            </label>

            <input
              id="endDate"
              type="date"
              disabled={isSubmitting}
              {...register("endDate")}
              className="w-full rounded border p-2"
            />

            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.endDate.message}
              </p>
            )}
          </div>
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
              : editingProjectId
                ? "Update Project"
                : "Add Project"}
          </button>

          {editingProjectId && (
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
