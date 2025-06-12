export interface ILicense {
  id: string;
  userId: string;
  status: 'active' | 'inactive' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILicenseCreation {
  userId: string;
  status?: 'active' | 'inactive' | 'expired';
  expiresAt: Date;
}