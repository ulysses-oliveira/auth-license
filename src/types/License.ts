export interface ILicense {
  id: string;
  userId: string;
  status: 'active' | 'inactive' | 'expired';
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ILicenseCreation {
  userId: string;
  status?: 'active' | 'inactive' | 'expired';
  expires_at: Date;
}