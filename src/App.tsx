import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { NotificationProvider } from './features/notifications/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { TestsPage } from './pages/TestsPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { ProfessionalDashboard } from './pages/professional/ProfessionalDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const AppContent: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      <main className="flex-1">
        <Routes>
          {/* Public Multi-Page Routes */}
          <Route
            path="/"
            element={<HomePage onOpenAuthModal={() => setAuthModalOpen(true)} />}
          />
          <Route path="/tests" element={<TestsPage />} />
          <Route
            path="/book"
            element={<BookingPage onOpenAuthModal={() => setAuthModalOpen(true)} />}
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />

          {/* Protected Role-Based Portals */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professional/dashboard"
            element={
              <ProtectedRoute allowedRoles={['professional', 'admin']}>
                <ProfessionalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
