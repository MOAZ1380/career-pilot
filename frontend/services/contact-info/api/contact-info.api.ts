import axios from "@/lib/axios";
import {
  ContactInfo,
  CreateContactInfoDto,
  UpdateContactInfoDto,
} from "../types/contact-info";

const BASE_URL = "/contact-info";

export const createContactInfo = async (
  data: CreateContactInfoDto,
): Promise<ContactInfo> => {
  try {
    console.log("Creating contact info with data:", data); // Debugging line
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating contact info:", error);
    throw error;
  }
};

export const getContactInfo = async (): Promise<ContactInfo> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateContactInfo = async (
  data: UpdateContactInfoDto,
): Promise<ContactInfo> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteContactInfo = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
