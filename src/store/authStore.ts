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
  updateProfile: (updates: Partial<User>) => void;
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
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {

          if (!user.isActive) {
            set({ isLoading: false });
            throw new Error('Account has been deactivated. Please contact administrator.');
          }

          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          set({ isLoading: false });
          return false;
        }
        
        // Create new user
        const newUser: User & { password: string } = {
          id: Date.now().toString(),
          email: userData.email,
          password: userData.password,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          studentId: userData.studentId,
          department: userData.department,
          createdAt: new Date(),
          isActive: true,
        };
        
        users.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        set({ 
          user: userWithoutPassword, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          
          // Update in mock database
          const userIndex = users.findIndex(u => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
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