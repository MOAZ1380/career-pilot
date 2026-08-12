import axios from "@/lib/axios";
import { CreateProjectDto, Project, UpdateProjectDto } from "../types/project";

const BASE_URL = "/project";

export const createProject = async (
  data: CreateProjectDto,
): Promise<Project> => {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const updateProject = async (
  data: UpdateProjectDto,
): Promise<Project> => {
  try {
    const response = await axios.patch(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (): Promise<void> => {
  try {
    await axios.delete(BASE_URL);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
