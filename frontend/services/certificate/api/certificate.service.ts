import axios from "@/lib/axios";

import type {
  Certificate,
  CreateCertificateDto,
  UpdateCertificateDto,
} from "../types/certificate";

const BASE_URL = "/certificate";

/**
 * Create a new certificate
 */
export const createCertificate = async (
  data: CreateCertificateDto,
): Promise<Certificate> => {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating certificate:", error);

    throw error;
  }
};

/**
 * Get all certificates
 */
export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const response = await axios.get(BASE_URL);

    return response.data;
  } catch (error) {
    console.error("Error fetching certificates:", error);

    throw error;
  }
};

/**
 * Update a certificate
 */
export const updateCertificate = async (
  data: UpdateCertificateDto,
): Promise<Certificate> => {
  try {
    const response = await axios.patch(BASE_URL, data);

    return response.data;
  } catch (error) {
    console.error("Error updating certificate:", error);

    throw error;
  }
};

/**
 * Delete a certificate
 */
export const deleteCertificate = async (): Promise<void> => {
  try {
    await axios.delete(BASE_URL);

    console.log("Certificate deleted successfully");
  } catch (error) {
    console.error("Error deleting certificate:", error);

    throw error;
  }
};
