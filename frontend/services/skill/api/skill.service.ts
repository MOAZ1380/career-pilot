import axios from "@/lib/axios";
import { CreateSkillDto, Skill, UpdateSkillDto } from "../types/skill";

const BASE_URL = "/skill";

export const createSkill = async (data: CreateSkillDto): Promise<Skill> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateSkill = async (data: UpdateSkillDto): Promise<Skill> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteSkill = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
