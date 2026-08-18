"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  contactInfoSchema,
  type ContactInfoFormData,
} from "../schemas/contact-info.schema";

import {
  createContactInfo,
  deleteContactInfo,
  getContactInfo,
  updateContactInfo,
} from "../api/contact-info.api";

import { LinkType } from "../types/contact-info";

const linkTypeOptions = [
  { value: LinkType.LINKEDIN, label: "LinkedIn" },
  { value: LinkType.GITHUB, label: "GitHub" },
  { value: LinkType.PORTFOLIO, label: "Portfolio" },
  { value: LinkType.FACEBOOK, label: "Facebook" },
  { value: LinkType.TWITTER, label: "Twitter / X" },
  { value: LinkType.OTHER, label: "Other" },
];

export default function ContactInfoForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [contactInfoExists, setContactInfoExists] = useState(false);
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    mode: "onBlur",
    defaultValues: {
      phone: "",
      email: "",
      country: "",
      city: "",
      links: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const links = useWatch({
    control,
    name: "links",
  });

  const loadContactInfo = async () => {
    try {
      const data = await getContactInfo();

      setContactInfoExists(true);

      reset({
        phone: data.phone ?? "",
        email: data.email ?? "",
        country: data.country ?? "",
        city: data.city ?? "",
        links:
          data.links?.map((link) => ({
            type: link.type,
            url: link.url,
          })) ?? [],
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setContactInfoExists(false);
        return;
      }

      setError("root", {
        type: "server",
        message: "Failed to load contact information.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContactInfo();
  }, []);

  const onSubmit = async (data: ContactInfoFormData) => {
    setSuccess("");
    setError("root", {});

    const cleanedData = {
      ...data,
      links: data.links?.filter((link) => link.url.trim() !== ""),
    };

    try {
      if (contactInfoExists) {
        await updateContactInfo(cleanedData);

        setSuccess("Contact information updated successfully.");
      } else {
        await createContactInfo(cleanedData);

        setContactInfoExists(true);

        setSuccess("Contact information created successfully.");
      }

      await loadContactInfo();
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

  const handleDelete = async () => {
    setSuccess("");
    setError("root", {});

    try {
      await deleteContactInfo();

      setContactInfoExists(false);

      reset({
        phone: "",
        email: "",
        country: "",
        city: "",
        links: [],
      });

      setSuccess("Contact information deleted successfully.");
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

  const getAvailableLinkType = (currentIndex?: number) => {
    return linkTypeOptions.find((option) => {
      return !links?.some(
        (link, index) => index !== currentIndex && link?.type === option.value,
      );
    });
  };

  const handleAddLink = () => {
    const availableType = getAvailableLinkType();

    if (!availableType) {
      return;
    }

    append({
      type: availableType.value,
      url: "",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl rounded border p-6 shadow">
        <p className="text-sm text-gray-600">Loading contact information...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded border p-6 shadow">
      <h1 className="mb-2 text-2xl font-bold">
        {contactInfoExists
          ? "Edit Contact Information"
          : "Add Contact Information"}
      </h1>

      <p className="mb-6 text-sm text-gray-600">
        {contactInfoExists
          ? "Update your contact information."
          : "Add your contact information to your profile."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            Phone
          </label>

          <input
            id="phone"
            type="tel"
            placeholder="e.g. +201012345678"
            disabled={isSubmitting}
            {...register("phone")}
            className="w-full rounded border p-2"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            disabled={isSubmitting}
            {...register("email")}
            className="w-full rounded border p-2"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="mb-1 block text-sm font-medium">
            Country
          </label>

          <input
            id="country"
            type="text"
            placeholder="e.g. Egypt"
            disabled={isSubmitting}
            {...register("country")}
            className="w-full rounded border p-2"
          />

          {errors.country && (
            <p className="mt-1 text-sm text-red-500">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="mb-1 block text-sm font-medium">
            City
          </label>

          <input
            id="city"
            type="text"
            placeholder="e.g. Cairo"
            disabled={isSubmitting}
            {...register("city")}
            className="w-full rounded border p-2"
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* Professional Links */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Professional Links</h2>

            <p className="text-sm text-gray-600">
              Add links that you want to include in your CV.
            </p>
          </div>

          {fields.map((field, index) => {
            const currentType = links?.[index]?.type;

            return (
              <div key={field.id} className="space-y-3 rounded border p-4">
                {/* Link Type */}
                <div>
                  <label
                    htmlFor={`link-type-${field.id}`}
                    className="mb-1 block text-sm font-medium"
                  >
                    Link Type
                  </label>

                  <select
                    id={`link-type-${field.id}`}
                    disabled={isSubmitting}
                    {...register(`links.${index}.type`)}
                    className="w-full rounded border p-2"
                  >
                    <option value="">Select link type</option>

                    {linkTypeOptions.map((option) => {
                      const isUsedByAnotherLink = links?.some(
                        (link, linkIndex) =>
                          linkIndex !== index && link?.type === option.value,
                      );

                      return (
                        <option
                          key={option.value}
                          value={option.value}
                          disabled={isUsedByAnotherLink}
                        >
                          {option.label}
                        </option>
                      );
                    })}
                  </select>

                  {errors.links?.[index]?.type && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.links[index]?.type?.message}
                    </p>
                  )}
                </div>

                {/* URL */}
                <div>
                  <label
                    htmlFor={`link-url-${field.id}`}
                    className="mb-1 block text-sm font-medium"
                  >
                    URL
                  </label>

                  <input
                    id={`link-url-${field.id}`}
                    type="url"
                    placeholder={
                      currentType === LinkType.LINKEDIN
                        ? "https://linkedin.com/in/username"
                        : currentType === LinkType.GITHUB
                          ? "https://github.com/username"
                          : currentType === LinkType.PORTFOLIO
                            ? "https://example.com"
                            : "https://example.com"
                    }
                    disabled={isSubmitting}
                    {...register(`links.${index}.url`)}
                    className="w-full rounded border p-2"
                  />

                  {errors.links?.[index]?.url && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.links[index]?.url?.message}
                    </p>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={isSubmitting}
                  className="text-sm text-red-500 hover:underline disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* Add Link */}
          <button
            type="button"
            onClick={handleAddLink}
            disabled={isSubmitting || fields.length === linkTypeOptions.length}
            className="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            + Add Link
          </button>

          {fields.length === linkTypeOptions.length && (
            <p className="text-sm text-gray-500">
              You have added all available link types.
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
            className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
          >
            {isSubmitting
              ? contactInfoExists
                ? "Updating..."
                : "Saving..."
              : contactInfoExists
                ? "Update Contact Information"
                : "Save Contact Information"}
          </button>

          {contactInfoExists && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-full rounded border border-red-500 p-2 text-red-500 disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
