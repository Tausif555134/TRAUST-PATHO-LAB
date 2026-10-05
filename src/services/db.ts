import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Service,
  Professional,
  Patient,
  Booking,
  BookingStatus,
  MedicalReport,
  Review,
  Notification,
} from '../types';
import {
  initialServices,
  initialProfessionals,
  initialPatients,
  initialBookings,
  initialReports,
  initialReviews,
} from './mockData';

// Setup Supabase Client if keys exist
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage keys for offline / demo mode
const STORAGE_KEYS = {
  SERVICES: 'carepulse_services_v1',
  PROFESSIONALS: 'carepulse_professionals_v1',
  PATIENTS: 'carepulse_patients_v1',
  BOOKINGS: 'carepulse_bookings_v1',
  REPORTS: 'carepulse_reports_v1',
  REVIEWS: 'carepulse_reviews_v1',
  NOTIFICATIONS: 'carepulse_notifications_v1',
};

// Dispatch local storage updates event
const DB_CHANGE_EVENT = 'carepulse_db_change';
const notifyDbChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT));
  }
};

export const subscribeToDbChanges = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(DB_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(DB_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyDbChange();
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const dbService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  // RESET
  resetToDemoData(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(initialServices));
    localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(initialProfessionals));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(initialPatients));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(initialReports));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    notifyDbChange();
  },

  // SERVICES
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').select('*').order('name');
      if (!error && data) return data as Service[];
    }
    return getLocal<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
  },

  async getServiceById(id: string): Promise<Service | undefined> {
    const all = await this.getServices();
    return all.find((s) => s.id === id);
  },

  async saveService(service: Service): Promise<Service> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('services').upsert(service);
    }
    const current = getLocal<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
    const existingIndex = current.findIndex((s) => s.id === service.id);
    if (existingIndex >= 0) {
      current[existingIndex] = service;
    } else {
      current.push(service);
    }
    setLocal(STORAGE_KEYS.SERVICES, current);
    return service;
  },

  async deleteService(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('services').delete().eq('id', id);
    }
    const current = getLocal<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
    const updated = current.filter((s) => s.id !== id);
    setLocal(STORAGE_KEYS.SERVICES, updated);
  },

  // PROFESSIONALS
  async getProfessionals(): Promise<Professional[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('professionals').select('*');
      if (!error && data) return data as Professional[];
    }
    return getLocal<Professional[]>(STORAGE_KEYS.PROFESSIONALS, initialProfessionals);
  },

  async getProfessionalById(id: string): Promise<Professional | undefined> {
    const all = await this.getProfessionals();
    return all.find((p) => p.id === id);
  },

  async saveProfessional(pro: Professional): Promise<Professional> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('professionals').upsert(pro);
    }
    const current = getLocal<Professional[]>(STORAGE_KEYS.PROFESSIONALS, initialProfessionals);
    const index = current.findIndex((p) => p.id === pro.id);
    if (index >= 0) {
      current[index] = pro;
    } else {
      current.push(pro);
    }
    setLocal(STORAGE_KEYS.PROFESSIONALS, current);
    return pro;
  },

  // PATIENTS
  async getPatients(): Promise<Patient[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('patients').select('*');
      if (!error && data) return data as Patient[];
    }
    return getLocal<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
  },

  async getPatientById(id: string): Promise<Patient | undefined> {
    const all = await this.getPatients();
    return all.find((p) => p.id === id);
  },

  async savePatient(patient: Patient): Promise<Patient> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('patients').upsert(patient);
    }
    const current = getLocal<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
    const index = current.findIndex((p) => p.id === patient.id);
    if (index >= 0) {
      current[index] = patient;
    } else {
      current.push(patient);
    }
    setLocal(STORAGE_KEYS.PATIENTS, current);
    return patient;
  },

  // BOOKINGS
  async getBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Booking[];
    }
    return getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    const all = await this.getBookings();
    return all.find((b) => b.id === id);
  },

  async getBookingsByPatientId(patientId: string): Promise<Booking[]> {
    const all = await this.getBookings();
    return all.filter((b) => b.patientId === patientId);
  },

  async getBookingsByProfessionalId(proId: string): Promise<Booking[]> {
    const all = await this.getBookings();
    return all.filter((b) => b.assignedProfessionalId === proId);
  },

  async createBooking(booking: Booking): Promise<Booking> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('bookings').insert(booking);
    }
    const current = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
    current.unshift(booking);
    setLocal(STORAGE_KEYS.BOOKINGS, current);

    // Create confirmation notification
    await this.addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.patientId,
      title: 'Booking Confirmed',
      message: `Your appointment for ${booking.serviceName} on ${booking.date} at ${booking.timeSlot} is confirmed. Booking Code: ${booking.bookingCode}`,
      type: 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: `/patient/dashboard`,
    });

    return booking;
  },

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    notes?: string,
    updatedBy: string = 'system'
  ): Promise<Booking> {
    const current = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
    const booking = current.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    const previousStatus = booking.status;
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    if (status === 'cancelled' && notes) {
      booking.cancellationReason = notes;
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('bookings').update({ status, updated_at: booking.updatedAt }).eq('id', bookingId);
      await supabase.from('booking_status_history').insert({
        booking_id: bookingId,
        from_status: previousStatus,
        to_status: status,
        updated_by: updatedBy,
        notes,
      });
    }

    setLocal(STORAGE_KEYS.BOOKINGS, current);

    // Notify patient of status update
    const statusTitles: Record<BookingStatus, string> = {
      pending: 'Booking Pending',
      confirmed: 'Booking Confirmed',
      assigned: 'Clinician Assigned',
      on_the_way: 'Clinician On the Way',
      arrived: 'Clinician Arrived',
      in_progress: 'Checkup In Progress',
      completed: 'Checkup Completed',
      cancelled: 'Booking Cancelled',
    };

    const statusMessages: Record<BookingStatus, string> = {
      pending: `Your booking ${booking.bookingCode} is awaiting confirmation.`,
      confirmed: `Your booking ${booking.bookingCode} has been confirmed.`,
      assigned: `A healthcare professional has been assigned to your booking ${booking.bookingCode}.`,
      on_the_way: `Your clinician is on the way to your doorstep for booking ${booking.bookingCode}.`,
      arrived: `Your clinician has arrived at your address for booking ${booking.bookingCode}.`,
      in_progress: `Your home checkup is currently underway.`,
      completed: `Your visit is completed! Your clinical report is now available.`,
      cancelled: `Your appointment ${booking.bookingCode} was cancelled: ${notes || 'No reason provided'}.`,
    };

    await this.addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.patientId,
      title: statusTitles[status],
      message: statusMessages[status],
      type: status === 'cancelled' ? 'cancellation' : 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/patient/dashboard',
    });

    return booking;
  },

  async assignProfessional(bookingId: string, professionalId: string): Promise<Booking> {
    const pros = await this.getProfessionals();
    const assignedPro = pros.find((p) => p.id === professionalId);
    if (!assignedPro) throw new Error('Professional not found');

    const current = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
    const booking = current.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.assignedProfessionalId = professionalId;
    booking.assignedProfessional = assignedPro;
    booking.status = 'assigned';
    booking.updatedAt = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('bookings')
        .update({
          assigned_professional_id: professionalId,
          status: 'assigned',
          updated_at: booking.updatedAt,
        })
        .eq('id', bookingId);
    }

    setLocal(STORAGE_KEYS.BOOKINGS, current);

    // Notify professional
    await this.addNotification({
      id: `notif-pro-${Date.now()}`,
      userId: assignedPro.userId,
      title: 'New Patient Visit Assigned',
      message: `You have been assigned to visit ${booking.patientName} for ${booking.serviceName} on ${booking.date} at ${booking.timeSlot}.`,
      type: 'professional',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/professional/dashboard',
    });

    // Notify patient
    await this.addNotification({
      id: `notif-pat-${Date.now()}`,
      userId: booking.patientId,
      title: 'Clinician Assigned to Your Visit',
      message: `${assignedPro.name} (${assignedPro.role}) has been assigned to your appointment on ${booking.date}.`,
      type: 'professional',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/patient/dashboard',
    });

    return booking;
  },

  // REPORTS
  async getReports(): Promise<MedicalReport[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reports').select('*');
      if (!error && data) return data as MedicalReport[];
    }
    return getLocal<MedicalReport[]>(STORAGE_KEYS.REPORTS, initialReports);
  },

  async getReportByBookingId(bookingId: string): Promise<MedicalReport | undefined> {
    const all = await this.getReports();
    return all.find((r) => r.bookingId === bookingId);
  },

  async saveReport(report: MedicalReport): Promise<MedicalReport> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('reports').upsert(report);
    }
    const current = getLocal<MedicalReport[]>(STORAGE_KEYS.REPORTS, initialReports);
    const idx = current.findIndex((r) => r.bookingId === report.bookingId);
    if (idx >= 0) {
      current[idx] = report;
    } else {
      current.push(report);
    }
    setLocal(STORAGE_KEYS.REPORTS, current);

    // Auto update booking to completed
    await this.updateBookingStatus(report.bookingId, 'completed', 'Report submitted by clinician', report.professionalName);

    // Notify patient
    await this.addNotification({
      id: `notif-rep-${Date.now()}`,
      userId: report.patientId,
      title: 'Medical Report & Prescription Ready',
      message: `Your clinical report and prescription for ${report.serviceName} are now ready to view and download.`,
      type: 'report',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/patient/dashboard',
    });

    return report;
  },

  // REVIEWS
  async getReviews(): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reviews').select('*');
      if (!error && data) return data as Review[];
    }
    return getLocal<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews);
  },

  async addReview(review: Review): Promise<Review> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('reviews').insert(review);
    }
    const current = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews);
    current.unshift(review);
    setLocal(STORAGE_KEYS.REVIEWS, current);
    return review;
  },

  // NOTIFICATIONS
  async getNotifications(userId?: string): Promise<Notification[]> {
    const all = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (!userId) return all;
    return all.filter((n) => n.userId === userId || n.userId === 'admin' || n.userId === 'all');
  },

  async addNotification(notif: Notification): Promise<void> {
    const current = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    current.unshift(notif);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, current);
  },

  async markNotificationRead(id: string): Promise<void> {
    const current = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const target = current.find((n) => n.id === id);
    if (target) {
      target.isRead = true;
      setLocal(STORAGE_KEYS.NOTIFICATIONS, current);
    }
  },
};
