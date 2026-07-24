import axios from "@/lib/axios";
import {
  CreateProfileDto,
  Profile,
  ProfileResponse,
  UpdateProfileDto,
} from "../types/profile";

const BASE_URL = "/profile";

export const createProfile = async (
  data: CreateProfileDto,
): Promise<ProfileResponse> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileDto,
): Promise<ProfileResponse> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteProfile = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
