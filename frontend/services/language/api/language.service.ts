import api from "@/lib/axios";
import {
  CreateLanguageDto,
  Language,
  UpdateLanguageDto,
} from "../types/language";

const BASE_URL = "/language";

export const createLanguage = async (
  data: CreateLanguageDto,
): Promise<Language> => {
  const response = await api.post(BASE_URL, data);
  return response.data.data;
};

export const getLanguages = async (): Promise<Language[]> => {
  const response = await api.get(BASE_URL);
  return response.data.data;
};

export const getLanguageById = async (id: string): Promise<Language> => {
  const response = await api.get(`${BASE_URL}/${encodeURIComponent(id)}`);
  return response.data.data;
};

export const updateLanguage = async (
  id: string,
  data: Omit<UpdateLanguageDto, "id">,
): Promise<Language> => {
  const response = await api.patch(
    `${BASE_URL}/${encodeURIComponent(id)}`,
    data,
  );
  return response.data.data;
};

export const deleteLanguage = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${encodeURIComponent(id)}`);
};
