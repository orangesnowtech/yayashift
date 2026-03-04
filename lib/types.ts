export interface Submission {
  id?: string;
  friendlyId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  region: 'Region 20' | 'Region 51';
  zone: number;
  area: number;
  province: string;
  parishName: string;
  parishPastorName: string;
  description: string;
  auditionVideoUrl: string;
  paymentProofUrl: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'selected' | 'rejected';
  notes?: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  region: 'Region 20' | 'Region 51' | '';
  zone: string;
  area: string;
  province: string;
  parishName: string;
  parishPastorName: string;
  description: string;
  auditionVideo: File | null;
  paymentProof: File | null;
}
