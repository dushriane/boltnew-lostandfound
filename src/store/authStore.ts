import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  toggleUserStatus: (userId: string) => void;
  getAllUsers: () => (User & { password: string })[];
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'student' | 'faculty';
  studentId?: string;
  department?: string;
}

// Use the mock users from mockData
let users = [...mockUsers];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user && user.isActive) { // Changed from status === 'active'
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (userData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          joinDate: new Date(),
          createdAt: new Date(),
          status: 'active',
          isActive: true,
          role: userData.role || 'user'
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      deactivateUser: (userId: string) => {
        const { user } = get();
        if (user && user.id === userId) {
          set({ user: null, isAuthenticated: false });
        }
      },

      updateProfile: (data: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...data };
          set({ user: updatedUser });
          
          // Update in mock database
          const userIndex = users.findIndex(u => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...data };
          }
        }
      },

      toggleUserStatus: (userId: string) => {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          users[userIndex].isActive = !users[userIndex].isActive;
          
          // If current user is being deactivated, log them out
          const currentUser = get().user;
          if (currentUser && currentUser.id === userId && !users[userIndex].isActive) {
            set({ user: null, isAuthenticated: false });
          }
        }
      },

      getAllUsers: () => {
        return users;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);