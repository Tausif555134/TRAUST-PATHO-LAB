import {
  Service,
  Professional,
  Patient,
  Booking,
  BookingStatus,
  MedicalReport,
  Review,
  Notification,
  LabTest,
  LabInfo,
} from '../types';
import {
  initialServices,
  initialProfessionals,
  initialPatients,
  initialBookings,
  initialReports,
  initialReviews,
  initialLabTests,
  officialLabInfo,
} from './mockData';

// Frontend storage keys
const STORAGE_KEYS = {
  SERVICES: 'trust_patho_lab_services_v1',
  PROFESSIONALS: 'trust_patho_lab_professionals_v1',
  PATIENTS: 'trust_patho_lab_patients_v1',
  BOOKINGS: 'trust_patho_lab_bookings_v1',
  REPORTS: 'trust_patho_lab_reports_v1',
  REVIEWS: 'trust_patho_lab_reviews_v1',
  NOTIFICATIONS: 'trust_patho_lab_notifications_v1',
  LAB_TESTS: 'trust_patho_lab_tests_v1',
  LAB_INFO: 'trust_patho_lab_info_v1',
};


// Dispatch frontend storage updates event for UI reactivity
const DB_CHANGE_EVENT = 'trust_patho_lab_frontend_change';
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
    console.error('Frontend storage write error:', e);
  }
}

export const dbService = {
  // RESET FRONTEND DATA
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
    return getLocal<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
  },

  async getServiceById(id: string): Promise<Service | undefined> {
    const all = await this.getServices();
    return all.find((s) => s.id === id);
  },

  async saveService(service: Service): Promise<Service> {
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
    const current = getLocal<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
    const updated = current.filter((s) => s.id !== id);
    setLocal(STORAGE_KEYS.SERVICES, updated);
  },

  // PROFESSIONALS
  async getProfessionals(): Promise<Professional[]> {
    return getLocal<Professional[]>(STORAGE_KEYS.PROFESSIONALS, initialProfessionals);
  },

  async getProfessionalById(id: string): Promise<Professional | undefined> {
    const all = await this.getProfessionals();
    return all.find((p) => p.id === id);
  },

  async saveProfessional(pro: Professional): Promise<Professional> {
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
    return getLocal<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
  },

  async getPatientById(id: string): Promise<Patient | undefined> {
    const all = await this.getPatients();
    return all.find((p) => p.id === id);
  },

  async savePatient(patient: Patient): Promise<Patient> {
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
    const current = getLocal<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
    current.unshift(booking);
    setLocal(STORAGE_KEYS.BOOKINGS, current);

    // Create confirmation notification in frontend store
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

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    if (status === 'cancelled' && notes) {
      booking.cancellationReason = notes;
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
      title: statusTitles[status] || 'Booking Update',
      message: statusMessages[status] || `Status updated to ${status}`,
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
    return getLocal<MedicalReport[]>(STORAGE_KEYS.REPORTS, initialReports);
  },

  async getReportByBookingId(bookingId: string): Promise<MedicalReport | undefined> {
    const all = await this.getReports();
    return all.find((r) => r.bookingId === bookingId);
  },

  async saveReport(report: MedicalReport): Promise<MedicalReport> {
    const current = getLocal<MedicalReport[]>(STORAGE_KEYS.REPORTS, initialReports);
    const idx = current.findIndex((r) => r.bookingId === report.bookingId);
    if (idx >= 0) {
      current[idx] = report;
    } else {
      current.push(report);
    }
    setLocal(STORAGE_KEYS.REPORTS, current);

    // Update booking to completed
    await this.updateBookingStatus(
      report.bookingId,
      'completed',
      'Report submitted by clinician',
      report.professionalName
    );

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
    return getLocal<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews);
  },

  async addReview(review: Review): Promise<Review> {
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

  // --------------------------------------------------------------------------
  // TRUST PATHO LAB: OFFICIAL TEST PRICE LIST (62 TESTS FROM PRICE LIST IMAGE)
  // --------------------------------------------------------------------------
  async fetchCsrfToken(): Promise<string | null> {
    try {
      const res = await fetch('/api/csrf-token');
      if (res.ok) {
        const data = await res.json();
        return data.csrfToken;
      }
    } catch {
      // Backend offline / standalone client fallback
    }
    return null;
  },

  async getLabInfo(): Promise<LabInfo> {
    try {
      const res = await fetch('/api/lab-info');
      if (res.ok) {
        const info = await res.json();
        return {
          name: info.name || officialLabInfo.name,
          subtitle: info.subtitle || officialLabInfo.subtitle,
          registrationNo: info.registration_no || officialLabInfo.registrationNo,
          address: info.address || officialLabInfo.address,
          phones: info.phones ? info.phones.split(',').map((p: string) => p.trim()) : officialLabInfo.phones,
          whatsapp: info.whatsapp || officialLabInfo.whatsapp,
          established: info.established || officialLabInfo.established,
          services: info.services ? info.services.split(',').map((s: string) => s.trim()) : officialLabInfo.services,
          features: officialLabInfo.features,
          disclaimer: info.disclaimer || officialLabInfo.disclaimer,
        };
      }
    } catch {
      // Fallback to official lab info
    }
    return getLocal<LabInfo>(STORAGE_KEYS.LAB_INFO, officialLabInfo);
  },

  async getLabTests(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<LabTest[]> {
    // Try live server API first
    try {
      const q = new URLSearchParams();
      if (params?.search) q.append('search', params.search);
      if (params?.category && params.category !== 'All') q.append('category', params.category);
      if (params?.minPrice !== undefined) q.append('minPrice', String(params.minPrice));
      if (params?.maxPrice !== undefined) q.append('maxPrice', String(params.maxPrice));

      const res = await fetch(`/api/tests?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tests) && data.tests.length > 0) {
          // Sync with local storage
          const mapped: LabTest[] = data.tests.map((t: any) => ({
            id: t.id,
            slNo: t.sl_no,
            code: t.code,
            name: t.name,
            fullName: t.full_name,
            category: t.category,
            price: t.price,
            sampleType: t.sample_type,
            turnaroundTime: t.turnaround_time,
            fastingRequired: Boolean(t.fasting_required),
            isAvailable: Boolean(t.is_available),
          }));
          setLocal(STORAGE_KEYS.LAB_TESTS, mapped);
          return mapped;
        }
      }
    } catch {
      // Backend offline / standalone client fallback
    }

    // Local Storage Fallback with exact 62 tests
    let all = getLocal<LabTest[]>(STORAGE_KEYS.LAB_TESTS, initialLabTests);
    if (!all || all.length === 0) {
      all = initialLabTests;
      setLocal(STORAGE_KEYS.LAB_TESTS, all);
    }

    if (!params) return all;

    return all.filter((t) => {
      const matchesSearch =
        !params.search ||
        t.name.toLowerCase().includes(params.search.toLowerCase()) ||
        t.fullName.toLowerCase().includes(params.search.toLowerCase()) ||
        t.category.toLowerCase().includes(params.search.toLowerCase());

      const matchesCategory =
        !params.category || params.category === 'All' || t.category === params.category;

      const matchesMin = params.minPrice === undefined || t.price >= params.minPrice;
      const matchesMax = params.maxPrice === undefined || t.price <= params.maxPrice;

      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });
  },

  async getLabTestById(id: string): Promise<LabTest | undefined> {
    const tests = await this.getLabTests();
    return tests.find((t) => t.id === id || String(t.slNo) === id);
  },

  async updateLabTestPrice(id: string, newPrice: number, adminToken?: string): Promise<boolean> {
    const validPrice = Number(newPrice);
    if (isNaN(validPrice) || validPrice <= 0) return false;

    // Try backend API first with CSRF and Auth headers
    try {
      const csrf = await this.fetchCsrfToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrf) headers['x-csrf-token'] = csrf;
      if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

      const res = await fetch(`/api/tests/${id}/price`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ price: validPrice }),
      });
      if (res.ok) {
        // Backend successfully updated
      }
    } catch {
      // Fallback
    }

    // Also update local storage store for reactive instant feedback
    const tests = getLocal<LabTest[]>(STORAGE_KEYS.LAB_TESTS, initialLabTests);
    const target = tests.find((t) => t.id === id || String(t.slNo) === id);
    if (target) {
      target.price = validPrice;
      setLocal(STORAGE_KEYS.LAB_TESTS, tests);
      return true;
    }
    return false;
  },
};

