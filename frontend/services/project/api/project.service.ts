import axios from "@/lib/axios";
import { CreateProjectDto, Project, UpdateProjectDto } from "../types/project";

const BASE_URL = "/project";

export const createProject = async (
  data: CreateProjectDto,
): Promise<Project> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateProject = async (
  data: UpdateProjectDto,
): Promise<Project> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteProject = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
