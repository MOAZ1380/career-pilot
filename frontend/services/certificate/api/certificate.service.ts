import axios from "@/lib/axios";
import { Certificate } from "crypto";
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from "../types/certificate";

const BASE_URL = "/certificate";

export const createCertificate = async (
  data: CreateCertificateDto,
): Promise<Certificate> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const getCertificates = async (): Promise<Certificate[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateCertificate = async (
  data: UpdateCertificateDto,
): Promise<Certificate> => {
  const response = await axios.patch(BASE_URL, data);
  return response.data;
};

export const deleteCertificate = async (): Promise<void> => {
  await axios.delete(BASE_URL);
};
