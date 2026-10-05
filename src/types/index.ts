export type UserRole = 'patient' | 'professional' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  emergencyContact: string;
  medicalNotes?: string;
  createdAt: string;
}

export type ProfessionalRole = 
  | 'Doctor' 
  | 'Nurse' 
  | 'Lab Technician' 
  | 'Physiotherapist' 
  | 'Elderly Care Specialist';

export interface Professional {
  id: string;
  userId: string;
  name: string;
  role: ProfessionalRole;
  phone: string;
  email: string;
  qualification: string;
  experienceYears: number;
  serviceTypes: string[]; // service ids or categories
  serviceArea: string; // e.g., "South Mumbai", "Downtown", "West Sector"
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  totalVisits: number;
  profilePhoto?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  inclusions: string[];
  durationMinutes: number;
  price: number;
  preparationInstructions: string[];
  popular?: boolean;
  isActive: boolean;
  imageUrl?: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Address {
  id?: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  instructions?: string;
  latitude?: number;
  longitude?: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  emergencyContact: string;
  medicalNotes?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  address: Address;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "09:00 AM - 10:00 AM"
  price: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  assignedProfessionalId?: string;
  assignedProfessional?: Professional;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  fromStatus: BookingStatus;
  toStatus: BookingStatus;
  updatedBy: string;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'card' | 'upi' | 'netbanking' | 'cash_on_visit';
  status: PaymentStatus;
  gatewayTransactionId?: string;
  signature?: string;
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "Twice a day after meals"
  duration: string; // e.g. "5 days"
  notes?: string;
}

export interface VitalSigns {
  bloodPressure?: string; // e.g. "120/80 mmHg"
  pulseRate?: number; // e.g. 72 bpm
  bloodSugar?: string; // e.g. "95 mg/dL (Fasting)"
  temperature?: string; // e.g. "98.6 °F"
  spO2?: number; // e.g. 98 %
  respiratoryRate?: number;
}

export interface MedicalReport {
  id: string;
  bookingId: string;
  patientId: string;
  professionalId: string;
  professionalName: string;
  professionalRole: string;
  serviceName: string;
  visitDate: string;
  vitals?: VitalSigns;
  observations: string;
  prescriptions: PrescriptionItem[];
  fileUrl?: string; // Supabase signed URL or uploaded attachment
  fileName?: string;
  doctorNotes?: string;
  verifiedSignature: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'professional' | 'report' | 'system' | 'cancellation';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  patientName: string;
  serviceName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
