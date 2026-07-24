import axios from "@/lib/axios";
import {
  CreateLanguageDto,
  Language,
  UpdateLanguageDto,
} from "../types/language";

const BASE_URL = "/language";

export const createLanguage = async (
  data: CreateLanguageDto,
): Promise<Language> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getLanguages = async (): Promise<Language[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateLanguage = async (
  data: UpdateLanguageDto,
): Promise<Language> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteLanguage = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
