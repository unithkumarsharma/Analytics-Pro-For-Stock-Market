import React, { createContext, useContext, useState } from 'react';

interface UserProfile {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth-token') === 'true';
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('auth-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Basic verification - accepts trader@analyticspro.com or admin
    return new Promise((resolve) => {
      setTimeout(() => {
        if (
          (email === 'trader@analyticspro.com' && password === 'admin') ||
          (email === 'admin@analyticspro.com' && password === 'admin') ||
          password.length >= 4 // Allow simple entry for testing ease
        ) {
          setIsAuthenticated(true);
          const profile = {
            email,
            name: email.split('@')[0].toUpperCase(),
            role: 'Trader Pro',
          };
          setUser(profile);
          localStorage.setItem('auth-token', 'true');
          localStorage.setItem('auth-user', JSON.stringify(profile));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
