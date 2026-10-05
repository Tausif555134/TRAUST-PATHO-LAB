import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../types';
import { initialPatients, initialProfessionals } from '../../services/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | 'guest';
  isAuthenticated: boolean;
  login: (emailOrPhone: string, role?: UserRole) => Promise<boolean>;
  signup: (fullName: string, email: string, phone: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchPersona: (personaKey: 'patient_rajesh' | 'patient_kamla' | 'doctor_aisha' | 'nurse_sunita' | 'admin' | 'guest') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILES: Record<string, UserProfile> = {
  patient_rajesh: {
    id: initialPatients[0].id,
    email: initialPatients[0].email || 'rajesh.verma@example.com',
    fullName: initialPatients[0].fullName,
    phone: initialPatients[0].phone,
    role: 'patient',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-01-01T00:00:00Z',
  },
  patient_kamla: {
    id: initialPatients[1].id,
    email: initialPatients[1].email || 'kamla.devi@example.com',
    fullName: initialPatients[1].fullName,
    phone: initialPatients[1].phone,
    role: 'patient',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-01-01T00:00:00Z',
  },
  doctor_aisha: {
    id: initialProfessionals[0].id,
    email: initialProfessionals[0].email,
    fullName: initialProfessionals[0].name,
    phone: initialProfessionals[0].phone,
    role: 'professional',
    avatarUrl: initialProfessionals[0].profilePhoto,
    createdAt: '2025-01-01T00:00:00Z',
  },
  nurse_sunita: {
    id: initialProfessionals[1].id,
    email: initialProfessionals[1].email,
    fullName: initialProfessionals[1].name,
    phone: initialProfessionals[1].phone,
    role: 'professional',
    avatarUrl: initialProfessionals[1].profilePhoto,
    createdAt: '2025-01-01T00:00:00Z',
  },
  admin: {
    id: 'admin-super',
    email: 'admin@trustpatholab.internal',
    fullName: 'Operations Command Center',
    phone: '+91 99999 88888',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-01-01T00:00:00Z',
  },
};

const AUTH_STORAGE_KEY = 'trust_patho_lab_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default to Patient Rajesh for immediate realistic interactive experience
    return DEMO_PROFILES.patient_rajesh;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (emailOrPhone: string, preferredRole: UserRole = 'patient'): Promise<boolean> => {
    // Check if matching demo profile
    if (emailOrPhone.toLowerCase().includes('admin')) {
      setCurrentUser(DEMO_PROFILES.admin);
      return true;
    }
    if (emailOrPhone.toLowerCase().includes('aisha') || preferredRole === 'professional') {
      setCurrentUser(DEMO_PROFILES.doctor_aisha);
      return true;
    }
    if (emailOrPhone.toLowerCase().includes('kamla')) {
      setCurrentUser(DEMO_PROFILES.patient_kamla);
      return true;
    }

    // Default or dynamic login
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@patient.trustpatholab.com`,
      fullName: 'Valued Patient',
      phone: emailOrPhone.includes('@') ? '+91 98765 00000' : emailOrPhone,
      role: preferredRole,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    return true;
  };

  const signup = async (
    fullName: string,
    email: string,
    phone: string,
    role: UserRole = 'patient'
  ): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchPersona = (
    personaKey: 'patient_rajesh' | 'patient_kamla' | 'doctor_aisha' | 'nurse_sunita' | 'admin' | 'guest'
  ) => {
    if (personaKey === 'guest') {
      setCurrentUser(null);
    } else if (DEMO_PROFILES[personaKey]) {
      setCurrentUser(DEMO_PROFILES[personaKey]);
    }
  };

  const role: UserRole | 'guest' = currentUser ? currentUser.role : 'guest';
  const isAuthenticated = Boolean(currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        login,
        signup,
        logout,
        switchPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
