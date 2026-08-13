export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateDto {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface UpdateCertificateDto extends Partial<CreateCertificateDto> {}

export interface ApiErrorShape {
  message: string | string[];
  error?: string;
  statusCode: number;
}
