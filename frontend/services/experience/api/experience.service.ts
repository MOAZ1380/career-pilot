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
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
};

export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

export const updateExperience = async (
  data: UpdateExperienceDto,
): Promise<Experience> => {
  try {
    const response = await axios.patch(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};

export const deleteExperience = async (): Promise<void> => {
  try {
    await axios.delete(BASE_URL);
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
};
