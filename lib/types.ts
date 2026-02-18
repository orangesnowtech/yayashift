export interface Submission {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  region: 'Region 20' | 'Region 51';
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
  province: string;
  parishName: string;
  parishPastorName: string;
  description: string;
  auditionVideo: File | null;
  paymentProof: File | null;
}
