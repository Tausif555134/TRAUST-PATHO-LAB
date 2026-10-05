import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { NotificationProvider } from './features/notifications/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';

import { HomePage } from './pages/HomePage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { BookingPage } from './pages/BookingPage';
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
          <Route
            path="/"
            element={<HomePage onOpenAuthModal={() => setAuthModalOpen(true)} />}
          />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route
            path="/book"
            element={<BookingPage onOpenAuthModal={() => setAuthModalOpen(true)} />}
          />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
