import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { apiFetch } from '../api/client';

export type Role = 'ADMIN' | 'CUSTOMER' | 'MANAGER' | 'TECHNICIAN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (emailOrUsername: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  registerCustomer: (data: { name: string; email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('decoradmin:auth-user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      window.localStorage.setItem('decoradmin:auth-user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('decoradmin:auth-user');
    }
  }, [user]);

  const login = async (emailOrUsername: string, password: string) => {
    let email = emailOrUsername.trim();

    // Allow using a simple username for the default admin by mapping it to an email
    if (!email.includes('@') && email.toLowerCase() === 'adminsofa') {
      email = 'adminsofa@example.com';
    }

    const response = await apiFetch<{
      user: AuthUser;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('accessToken', response.accessToken);
    }

    // Flush state so redirect after login sees the user (avoids race with navigate())
    flushSync(() => setUser(response.user));
    return response.user;
  };

  const registerCustomer = async (data: { name: string; email: string; password: string }) => {
    const response = await apiFetch<{
      user: AuthUser;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('accessToken', response.accessToken);
    }

    setUser(response.user);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('accessToken');
    }
  };

  const value: AuthContextValue = {
    user,
    login,
    logout,
    registerCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

