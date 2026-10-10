import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Activity,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  RefreshCw,
  X,
  Phone,
  MapPin,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { dbService, subscribeToDbChanges } from '../../services/db';
import {
  Booking,
  Professional,
  Patient,
  Service,
  BookingStatus,
  ProfessionalRole,
  LabTest,
} from '../../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'professionals' | 'services' | 'test_prices' | 'patients' | 'reports'>('bookings');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [testSearch, setTestSearch] = useState('');
  const [testCategoryFilter, setTestCategoryFilter] = useState('All');
  const [editingTestPrice, setEditingTestPrice] = useState<{ id: string; price: number } | null>(null);
  const [priceUpdateSuccess, setPriceUpdateSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');


  // Modal: Assign Professional
  const [assignModalBooking, setAssignModalBooking] = useState<Booking | null>(null);
  const [selectedProId, setSelectedProId] = useState<string>('');

  // Modal: Add/Edit Professional
  const [proModalOpen, setProModalOpen] = useState(false);
  const [editingPro, setEditingPro] = useState<Professional | null>(null);
  const [proFormData, setProFormData] = useState<Partial<Professional>>({
    name: '',
    role: 'Doctor',
    phone: '',
    email: '',
    qualification: '',
    experienceYears: 5,
    serviceArea: 'Central Metro Zone',
    isAvailable: true,
    isVerified: true,
  });

  // Modal: Add/Edit Service
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Partial<Service>>({
    name: '',
    category: 'Full Body & Preventive',
    description: '',
    inclusions: ['Clinical vitals evaluation', 'Digital consultation report'],
    durationMinutes: 45,
    price: 699,
    preparationInstructions: ['Keep previous records handy.'],
    isActive: true,
  });

  const loadAllData = async () => {
    try {
      const [allB, allP, allPat, allS, allTests] = await Promise.all([
        dbService.getBookings(),
        dbService.getProfessionals(),
        dbService.getPatients(),
        dbService.getServices(),
        dbService.getLabTests(),
      ]);
      setBookings(allB);
      setProfessionals(allP);
      setPatients(allPat);
      setServices(allS);
      setLabTests(allTests);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTestPrice = async (testId: string, newPrice: number) => {
    const ok = await dbService.updateLabTestPrice(testId, newPrice);
    if (ok) {
      setPriceUpdateSuccess(`Price updated to ₹${newPrice} successfully in database!`);
      const updated = await dbService.getLabTests();
      setLabTests(updated);
      setEditingTestPrice(null);
      setTimeout(() => setPriceUpdateSuccess(null), 3500);
    }
  };


  useEffect(() => {
    loadAllData();
    const unsubscribe = subscribeToDbChanges(() => {
      loadAllData();
    });
    return unsubscribe;
  }, []);

  // Compute Metrics
  const totalBookings = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysBookings = bookings.filter((b) => b.date === todayStr).length;
  const pendingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed' || !b.assignedProfessionalId
  ).length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'success')
    .reduce((acc, b) => acc + b.price, 0);

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.patientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.address.city.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Lab Tests for Rate Master Tab
  const testCategories: string[] = ['All', ...Array.from(new Set(labTests.map((t) => t.category)))];
  const filteredLabTests = labTests.filter((t) => {
    const matchesCat = testCategoryFilter === 'All' || t.category === testCategoryFilter;
    const q = testSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.fullName.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      String(t.slNo).includes(q);
    return matchesCat && matchesSearch;
  });

  // Handle Assign Clinician
  const handleConfirmAssignment = async () => {
    if (!assignModalBooking || !selectedProId) return;
    try {
      await dbService.assignProfessional(assignModalBooking.id, selectedProId);
      setAssignModalBooking(null);
      await loadAllData();
    } catch (err) {
      console.error('Assignment error:', err);
    }
  };

  // Handle Manual Status Change
  const handleChangeStatus = async (bookingId: string, newStatus: BookingStatus) => {
    await dbService.updateBookingStatus(bookingId, newStatus, 'Status changed via Admin Console', 'Admin');
    await loadAllData();
  };

  // Save Professional
  const handleSaveProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPro: Professional = {
      id: editingPro ? editingPro.id : `pro-${Date.now()}`,
      userId: editingPro ? editingPro.userId : `user-pro-${Date.now()}`,
      name: proFormData.name || 'Healthcare Professional',
      role: (proFormData.role as ProfessionalRole) || 'Doctor',
      phone: proFormData.phone || '+91 98000 00000',
      email: proFormData.email || 'pro@trustpatholab.internal',
      qualification: proFormData.qualification || 'MBBS / Registered',
      experienceYears: Number(proFormData.experienceYears) || 3,
      serviceTypes: proFormData.serviceTypes || ['srv-1'],
      serviceArea: proFormData.serviceArea || 'Metro Hub',
      isAvailable: proFormData.isAvailable ?? true,
      isVerified: proFormData.isVerified ?? true,
      rating: editingPro ? editingPro.rating : 5.0,
      totalVisits: editingPro ? editingPro.totalVisits : 0,
      profilePhoto:
        editingPro?.profilePhoto ||
        'https://images.unsplash.com/photo-1594824813576-90f7a552ee01?auto=format&fit=crop&w=400&q=80',
      createdAt: editingPro ? editingPro.createdAt : new Date().toISOString(),
    };
    await dbService.saveProfessional(newPro);
    setProModalOpen(false);
    setEditingPro(null);
    await loadAllData();
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      name: serviceFormData.name || 'New Health Checkup',
      category: serviceFormData.category || 'Full Body & Preventive',
      description: serviceFormData.description || 'Specialized doorstep procedure',
      inclusions: Array.isArray(serviceFormData.inclusions)
        ? serviceFormData.inclusions
        : ['Basic checkup'],
      durationMinutes: Number(serviceFormData.durationMinutes) || 30,
      price: Number(serviceFormData.price) || 499,
      preparationInstructions: Array.isArray(serviceFormData.preparationInstructions)
        ? serviceFormData.preparationInstructions
        : ['Relax comfortably.'],
      popular: false,
      isActive: serviceFormData.isActive ?? true,
      imageUrl:
        editingService?.imageUrl ||
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    };
    await dbService.saveService(newService);
    setServiceModalOpen(false);
    setEditingService(null);
    await loadAllData();
  };

  // Reset Demo Data
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all bookings, clinicians, and records to initial demo datasets?')) {
      dbService.resetToDemoData();
      loadAllData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                TRUST PATHO LAB Operations Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital & Dispatch Command Center
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-xs"
              title="Reset data to pristine demo state"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 my-6">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Bookings
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
              {totalBookings}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Today's Visits
            </span>
            <span className="text-xl sm:text-2xl font-black text-brand-700 mt-1 block">
              {todaysBookings}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Needs Dispatch
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">
              {pendingBookings}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Completed
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">
              {completedBookings}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Active Clinicians
            </span>
            <span className="text-xl sm:text-2xl font-black text-purple-700 mt-1 block">
              {professionals.filter((p) => p.isAvailable).length}
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Revenue
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-300 pb-3 mb-6 overflow-x-auto">
          {[
            { id: 'bookings', label: `Bookings & Dispatch (${bookings.length})` },
            { id: 'professionals', label: `Clinicians (${professionals.length})` },
            { id: 'test_prices', label: `Lab Tests & Pricing (${labTests.length})` },
            { id: 'services', label: `Home Packages (${services.length})` },
            { id: 'patients', label: `Patient Registry (${patients.length})` },
            { id: 'reports', label: 'Financial & Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: BOOKING DISPATCH MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search code, patient, city, test..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 text-xs rounded-xl border border-slate-300 bg-white outline-none"
                >
                  <option value="all">All Booking States</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Clinician Assigned</option>
                  <option value="on_the_way">On The Way</option>
                  <option value="arrived">Arrived</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Booking Ref</th>
                      <th className="p-4">Patient & Destination</th>
                      <th className="p-4">Service & Slot</th>
                      <th className="p-4">Fee / Payment</th>
                      <th className="p-4">Assigned Clinician</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No matching appointments found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4">
                            <span className="font-mono font-bold text-slate-900 block">
                              {b.bookingCode}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{b.patientName}</div>
                            <div className="text-[11px] text-slate-500">{b.patientPhone}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                              {b.address.houseFlat}, {b.address.area}, {b.address.city}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-900">{b.serviceName}</div>
                            <div className="text-[11px] text-brand-700 font-medium">
                              {b.date} · {b.timeSlot}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">₹{b.price}</div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                b.paymentStatus === 'success'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            {b.assignedProfessional ? (
                              <div>
                                <span className="font-semibold text-slate-900 block">
                                  {b.assignedProfessional.name}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {b.assignedProfessional.role}
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setAssignModalBooking(b);
                                  setSelectedProId(professionals[0]?.id || '');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-[11px] hover:bg-purple-100 border border-purple-200 transition"
                              >
                                + Assign Clinician
                              </button>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                handleChangeStatus(b.id, e.target.value as BookingStatus)
                              }
                              className={`text-[11px] font-bold p-1 rounded-lg border outline-none ${
                                b.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : b.status === 'cancelled'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-blue-50 text-blue-800 border-blue-300'
                              }`}
                            >
                              <option value="pending">pending</option>
                              <option value="confirmed">confirmed</option>
                              <option value="assigned">assigned</option>
                              <option value="on_the_way">on_the_way</option>
                              <option value="arrived">arrived</option>
                              <option value="in_progress">in_progress</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setAssignModalBooking(b);
                                setSelectedProId(b.assignedProfessionalId || professionals[0]?.id || '');
                              }}
                              className="text-xs text-slate-600 hover:text-purple-700 font-semibold px-2 py-1 rounded hover:bg-slate-100"
                            >
                              Reassign
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFESSIONALS MANAGEMENT */}
        {activeTab === 'professionals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Registered Clinicians & Homecare Staff
                </h3>
                <p className="text-xs text-slate-500">
                  Manage medical licenses, service zones, and live dispatch availability.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPro(null);
                  setProFormData({
                    name: '',
                    role: 'Doctor',
                    phone: '',
                    email: '',
                    qualification: '',
                    experienceYears: 5,
                    serviceArea: 'Central Metro Zone',
                    isAvailable: true,
                    isVerified: true,
                  });
                  setProModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-xs hover:bg-purple-800"
              >
                <UserPlus className="w-4 h-4" />
                Add Healthcare Professional
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            pro.profilePhoto ||
                            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={pro.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{pro.name}</h4>
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            {pro.role}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          pro.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={pro.isAvailable ? 'Available on Duty' : 'Off Duty'}
                      />
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mt-4">
                      <div>
                        <strong className="text-slate-800">Qualification:</strong> {pro.qualification}
                      </div>
                      <div>
                        <strong className="text-slate-800">Experience:</strong> {pro.experienceYears} years
                      </div>
                      <div>
                        <strong className="text-slate-800">Operating Zone:</strong> {pro.serviceArea}
                      </div>
                      <div className="flex items-center gap-4 pt-1 text-[11px]">
                        <span>★ {pro.rating} rating</span>
                        <span>{pro.totalVisits} completed visits</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={async () => {
                        await dbService.saveProfessional({
                          ...pro,
                          isAvailable: !pro.isAvailable,
                        });
                        await loadAllData();
                      }}
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition ${
                        pro.isAvailable
                          ? 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                          : 'border-slate-300 text-slate-600 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {pro.isAvailable ? 'On Duty' : 'Mark Off Duty'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingPro(pro);
                        setProFormData(pro);
                        setProModalOpen(true);
                      }}
                      className="text-xs font-bold text-purple-700 hover:underline"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES CATALOG MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Doorstep Health Services Catalog
                </h3>
                <p className="text-xs text-slate-500">
                  Update pricing, durations, clinical inclusions, and preparation guidelines.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceFormData({
                    name: '',
                    category: 'Full Body & Preventive',
                    description: '',
                    inclusions: ['Clinical vitals evaluation'],
                    durationMinutes: 45,
                    price: 699,
                    preparationInstructions: ['Keep previous records handy.'],
                    isActive: true,
                  });
                  setServiceModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-xs hover:bg-purple-800"
              >
                <Plus className="w-4 h-4" />
                Add Healthcare Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                        {s.category}
                      </span>
                      <span className="text-xs text-slate-400">{s.durationMinutes}m</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{s.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                    <div className="text-lg font-black text-slate-900 mt-3">₹{s.price}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingService(s);
                        setServiceFormData(s);
                        setServiceModalOpen(true);
                      }}
                      className="text-xs font-bold text-purple-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Deactivate service ${s.name}?`)) {
                          await dbService.deleteService(s.id);
                          await loadAllData();
                        }
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: LAB TEST PRICE MANAGEMENT */}
        {activeTab === 'test_prices' && (
          <div className="space-y-4">
            {/* Success Alert Banner */}
            {priceUpdateSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-semibold">{priceUpdateSuccess}</span>
                </div>
                <button
                  onClick={() => setPriceUpdateSuccess(null)}
                  className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Header & Stats Banner */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-black p-6 rounded-3xl text-white shadow-md border border-purple-800/40 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold mb-2">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Official 62-Item Pathology Price Schedule</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Pathology Laboratory Rate Master
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
                    Configure official diagnostic test rates in real-time. Edits are persisted securely with parameterised database queries and update all patient booking calculations instantaneously.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                    <span className="text-[10px] text-purple-200 uppercase tracking-wider block">Total Catalog</span>
                    <span className="text-xl font-black text-amber-400">{labTests.length} Tests</span>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                    <span className="text-[10px] text-purple-200 uppercase tracking-wider block">Price Range</span>
                    <span className="text-xl font-black text-white">
                      ₹{labTests.length ? Math.min(...labTests.map(t => t.price)) : 0} - ₹{labTests.length ? Math.max(...labTests.map(t => t.price)) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search test name (CBC, L.F.T, HBA1C), code, or Sl. No..."
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-700 focus:outline-none"
                  />
                  {testSearch && (
                    <button
                      onClick={() => setTestSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-500">
                  Showing <span className="text-purple-900 font-bold">{filteredLabTests.length}</span> of {labTests.length} tests
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {testCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTestCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      testCategoryFilter === cat
                        ? 'bg-purple-900 text-amber-300 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 w-16 text-center">Sl No</th>
                      <th className="p-4">Official Test Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Sample / Specimen</th>
                      <th className="p-4">Turnaround</th>
                      <th className="p-4 text-right">Official Rate</th>
                      <th className="p-4 text-right w-52">Configure Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredLabTests.map((t) => {
                      const isEditing = editingTestPrice?.id === t.id;
                      return (
                        <tr key={t.id} className="hover:bg-purple-50/40 transition">
                          <td className="p-4 text-center font-mono font-bold text-slate-400">
                            #{t.slNo}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{t.fullName}</div>
                            <div className="text-[10px] font-mono text-purple-700 mt-0.5">{t.code}</div>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                              {t.category}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">{t.sampleType}</td>
                          <td className="p-4 text-slate-600 font-medium">{t.turnaroundTime}</td>
                          <td className="p-4 text-right">
                            <span className="text-base font-black text-slate-900">
                              ₹{t.price}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-xs font-bold text-slate-500">₹</span>
                                <input
                                  type="number"
                                  min={10}
                                  max={50000}
                                  value={editingTestPrice.price}
                                  onChange={(e) =>
                                    setEditingTestPrice({
                                      id: t.id,
                                      price: Math.max(1, Number(e.target.value)),
                                    })
                                  }
                                  className="w-20 px-2 py-1 rounded-lg border border-purple-400 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveTestPrice(t.id, editingTestPrice.price)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingTestPrice(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setEditingTestPrice({ id: t.id, price: t.price })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-purple-900 font-bold text-xs transition border border-slate-200 hover:border-purple-300"
                              >
                                <Edit className="w-3 h-3 text-purple-700" />
                                Edit Price
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredLabTests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                          No diagnostic tests found matching "{testSearch}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PATIENTS REGISTRY */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Registered Patients Directory</h3>
                <p className="text-xs text-slate-500">Demographic baseline and emergency records.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                {patients.length} Registered
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Age / Gender</th>
                    <th className="p-4">Phone / Email</th>
                    <th className="p-4">Emergency Contact</th>
                    <th className="p-4">Medical Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {patients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{pat.fullName}</td>
                      <td className="p-4">
                        {pat.age} yrs · <span className="capitalize">{pat.gender}</span>
                      </td>
                      <td className="p-4">
                        <div>{pat.phone}</div>
                        <div className="text-[10px] text-slate-400">{pat.email || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-rose-700 font-semibold">{pat.emergencyContact}</td>
                      <td className="p-4 max-w-xs text-slate-500 truncate">
                        {pat.medicalNotes || 'None recorded'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL & ANALYTICS REPORT */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Gross Platform Revenue
                </span>
                <span className="text-3xl font-black text-slate-900">
                  ₹{totalRevenue.toLocaleString()}
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  From {bookings.filter((b) => b.paymentStatus === 'success').length} verified visits.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Completion Rate
                </span>
                <span className="text-3xl font-black text-emerald-600">
                  {totalBookings > 0
                    ? Math.round((completedBookings / totalBookings) * 100)
                    : 100}
                  %
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  {completedBookings} successfully completed clinical visits.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Cancellation Rate
                </span>
                <span className="text-3xl font-black text-rose-600">
                  {totalBookings > 0
                    ? Math.round(
                        (bookings.filter((b) => b.status === 'cancelled').length /
                          totalBookings) *
                          100
                      )
                    : 0}
                  %
                </span>
                <p className="text-xs text-slate-500 mt-2">Within safe clinical tolerances (&lt;5%).</p>
              </div>
            </div>

            {/* Most Booked Services Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Service Performance Breakdown
              </h3>
              <div className="space-y-3">
                {services.map((srv) => {
                  const count = bookings.filter((b) => b.serviceId === srv.id).length;
                  return (
                    <div key={srv.id} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{srv.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">{count} visits booked</span>
                        <span className="font-bold text-slate-900">
                          ₹{(count * srv.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ASSIGN PROFESSIONAL */}
        {assignModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Assign Clinician to Home Visit</h3>
                <button
                  onClick={() => setAssignModalBooking(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="font-bold text-slate-900">{assignModalBooking.serviceName}</div>
                <div className="text-slate-600">
                  Patient: {assignModalBooking.patientName} ({assignModalBooking.patientPhone})
                </div>
                <div className="text-slate-600">
                  Schedule: {assignModalBooking.date} ({assignModalBooking.timeSlot})
                </div>
                <div className="text-slate-500 line-clamp-1 mt-1">
                  Location: {assignModalBooking.address.houseFlat}, {assignModalBooking.address.city}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Certified Healthcare Professional
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {professionals.map((pro) => (
                    <label
                      key={pro.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition ${
                        selectedProId === pro.id
                          ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pro"
                          checked={selectedProId === pro.id}
                          onChange={() => setSelectedProId(pro.id)}
                          className="text-purple-600"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{pro.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {pro.role} · {pro.qualification} · Zone: {pro.serviceArea}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold ${
                          pro.isAvailable ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {pro.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssignment}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PROFESSIONAL */}
        {proModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">
                  {editingPro ? 'Edit Professional' : 'Register New Clinician'}
                </h3>
                <button
                  onClick={() => setProModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfessional} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    required
                    value={proFormData.name}
                    onChange={(e) => setProFormData({ ...proFormData, name: e.target.value })}
                    placeholder="e.g. Dr. Priya Rao, MD"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinical Role</label>
                    <select
                      value={proFormData.role}
                      onChange={(e) =>
                        setProFormData({ ...proFormData, role: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Lab Technician">Lab Technician</option>
                      <option value="Physiotherapist">Physiotherapist</option>
                      <option value="Elderly Care Specialist">Elderly Care Specialist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={proFormData.experienceYears}
                      onChange={(e) =>
                        setProFormData({ ...proFormData, experienceYears: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Qualifications & Degrees
                  </label>
                  <input
                    type="text"
                    required
                    value={proFormData.qualification}
                    onChange={(e) =>
                      setProFormData({ ...proFormData, qualification: e.target.value })
                    }
                    placeholder="MBBS, MD (Family Medicine), etc."
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={proFormData.phone}
                      onChange={(e) => setProFormData({ ...proFormData, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Zone</label>
                    <input
                      type="text"
                      required
                      value={proFormData.serviceArea}
                      onChange={(e) =>
                        setProFormData({ ...proFormData, serviceArea: e.target.value })
                      }
                      placeholder="e.g. South Metro Sector"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setProModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold"
                  >
                    Save Professional
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT SERVICE */}
        {serviceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">
                  {editingService ? 'Edit Service' : 'Add New Service Package'}
                </h3>
                <button
                  onClick={() => setServiceModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    placeholder="e.g. Cardiac Home Care"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={serviceFormData.category}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, category: e.target.value })
                      }
                      placeholder="e.g. Diagnostic & Lab"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fee (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={serviceFormData.price}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, price: Number(e.target.value) })
                      }
                      placeholder="599"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={serviceFormData.durationMinutes}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Description</label>
                  <textarea
                    rows={2}
                    required
                    value={serviceFormData.description}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, description: e.target.value })
                    }
                    placeholder="Describe the procedure and who will conduct it..."
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
