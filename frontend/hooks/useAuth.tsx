
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password_unused: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = authService.getAuthenticatedUser();
      setUser(storedUser);
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = useCallback(async (username: string, password_unused: string): Promise<boolean> => {
    setIsLoading(true);
    const loggedInUser = await authService.login(username, password_unused);
    setUser(loggedInUser);
    setIsLoading(false);
    return !!loggedInUser;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
