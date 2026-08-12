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
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating language:", error);
    throw error;
  }
};

export const getLanguages = async (): Promise<Language[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
};

export const updateLanguage = async (
  data: UpdateLanguageDto,
): Promise<Language> => {
  try {
    const response = await axios.patch(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error updating language:", error);
    throw error;
  }
};

export const deleteLanguage = async (): Promise<void> => {
  try {
    await axios.delete(BASE_URL);
  } catch (error) {
    console.error("Error deleting language:", error);
    throw error;
  }
};
