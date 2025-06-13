import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
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

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'Lost & Found Admin',
    role: 'admin',
    department: 'Student Services',
    createdAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '2',
    email: 'john.doe@student.university.edu',
    password: 'student123',
    name: 'John Doe',
    phone: '+250788123456',
    role: 'student',
    studentId: 'ST2024001',
    department: 'Computer Science',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: '3',
    email: 'prof.smith@university.edu',
    password: 'faculty123',
    name: 'Prof. Sarah Smith',
    phone: '+250788654321',
    role: 'faculty',
    department: 'Mathematics',
    createdAt: new Date('2024-01-10'),
    isActive: true,
  },
];

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
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user && user.isActive) {
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
        const existingUser = mockUsers.find(u => u.email === userData.email);
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
        
        mockUsers.push(newUser);
        
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
          const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
          }
        }
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