import axios from "@/lib/axios";
import {
  CreateResumeDto,
  Resume,
  ResumeDetails,
  UpdateResumeDto,
} from "../types/resume";

const BASE_URL = "/resume";

export const createResume = async (data: CreateResumeDto): Promise<Resume> => {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating resume:", error);
    throw error;
  }
};

export const getResumes = async (): Promise<Resume[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw error;
  }
};

export const getResume = async (id: string): Promise<ResumeDetails> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resume:", error);
    throw error;
  }
};

export const updateResume = async (
  id: string,
  data: UpdateResumeDto,
): Promise<ResumeDetails> => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating resume:", error);
    throw error;
  }
};

export const deleteResume = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};
