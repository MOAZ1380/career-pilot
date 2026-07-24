import axios from "@/lib/axios";
import {
  CreateEducationDto,
  Education,
  UpdateEducationDto,
} from "../types/education";

const BASE_URL = "/education";

export const createEducation = async (
  data: CreateEducationDto,
): Promise<Education> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getEducations = async (): Promise<Education[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateEducation = async (
  data: UpdateEducationDto,
): Promise<Education> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteEducation = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
