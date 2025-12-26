export interface Profile {
  id: string;
  birthDate: string; // yyyy-MM-dd
  birthTime: string; // HH:mm
  gender: 'male' | 'female';
  city?: string;
  label?: string;
  createdAt?: string; // ISO string
}

export type CreateProfileVariables = {
  birthDate: string;
  birthTime: string;
  gender: 'male' | 'female';
  city?: string;
  label?: string;
};

export type UpdateProfileVariables = Partial<CreateProfileVariables> & {
  id: string;
};
