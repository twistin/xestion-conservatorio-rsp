
import { User, UserRole } from '../types';
import { mockUsers } from './mockData';

export const login = async (username: string, password_unused: string): Promise<User | null> => {
  // In a real app, password would be used and validated against a backend.
  // Here, we just find by username for simplicity.
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username);
      if (user) {
        // Simulate setting a token or session
        localStorage.setItem('authUser', JSON.stringify(user));
        resolve(user);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('authUser');
      resolve();
    }, 200);
  });
};

export const getAuthenticatedUser = (): User | null => {
  const storedUser = localStorage.getItem('authUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem('authUser');
      return null;
    }
  }
  return null;
};
