import axios from "@/lib/axios";
import {
  CreateExperienceDto,
  Experience,
  UpdateExperienceDto,
} from "../types/experience";

const BASE_URL = "/experience";

export const createExperience = async (
  data: CreateExperienceDto,
): Promise<Experience> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getExperiences = async (): Promise<Experience[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateExperience = async (
  data: UpdateExperienceDto,
): Promise<Experience> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteExperience = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
