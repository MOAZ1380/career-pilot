import api from "@/lib/axios";
import { CreateSkillDto, Skill, UpdateSkillDto } from "../types/skill";

const BASE_URL = "/skill";

export const createSkill = async (data: CreateSkillDto): Promise<Skill> => {
  const response = await api.post(BASE_URL, data);
  return response.data.data;
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get(BASE_URL);
  return response.data.data;
};

export const getSkillById = async (id: string): Promise<Skill> => {
  const response = await api.get(`${BASE_URL}/${encodeURIComponent(id)}`);
  return response.data.data;
};

export const updateSkill = async (
  id: string,
  data: Omit<UpdateSkillDto, "id">,
): Promise<Skill> => {
  const response = await api.patch(
    `${BASE_URL}/${encodeURIComponent(id)}`,
    data,
  );
  return response.data.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${encodeURIComponent(id)}`);
};
