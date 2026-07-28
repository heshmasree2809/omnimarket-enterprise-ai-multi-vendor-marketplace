import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Address } from '../types/marketplace';
import { MOCK_USERS } from '../data/mockData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateAddresses: (addresses: Address[]) => void;
  verifyEmail: () => void;
  sendPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('omni_user');
    return saved ? JSON.parse(saved) : MOCK_USERS[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('omni_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('omni_user');
    }
  }, [user]);

  const role = user?.role || 'customer';

  const login = async (email: string): Promise<boolean> => {
    // Find matching mock user or create default customer
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      email,
      name: email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
      role: 'customer',
      emailVerified: true,
      addresses: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    showToast(`Logged in successfully as ${newUser.name}`, 'success');
    return true;
  };

  const signup = async (name: string, email: string, _password?: string, role: UserRole = 'customer'): Promise<boolean> => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      email,
      name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
      role,
      emailVerified: false,
      addresses: [],
      createdAt: new Date().toISOString().split('T')[0],
      sellerProfile: role === 'seller' ? {
        storeName: `${name}'s Store`,
        description: 'Quality multi-vendor merchant account on OmniMarket.',
        logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
        verified: false,
        rating: 5.0,
        totalSales: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      } : undefined,
    };
    setUser(newUser);
    showToast('Account created successfully! Check email for verification link.', 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('You have been signed out.', 'info');
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const match = MOCK_USERS.find(u => u.role === targetRole);
    if (match) {
      setUser(match);
      showToast(`Switched view to Demo ${targetRole.toUpperCase()} (${match.name})`, 'info');
    }
  };

  const updateAddresses = (addresses: Address[]) => {
    if (!user) return;
    const updated = { ...user, addresses };
    setUser(updated);
    showToast('Shipping addresses updated', 'success');
  };

  const verifyEmail = () => {
    if (!user) return;
    setUser({ ...user, emailVerified: true });
    showToast('Email address verified successfully!', 'success');
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    showToast(`Password reset link sent to ${email}`, 'info');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchDemoRole,
        updateAddresses,
        verifyEmail,
        sendPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
