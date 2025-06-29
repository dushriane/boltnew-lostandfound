"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const mockData_1 = require("../data/mockData");
// Use the mock users from mockData
let users = [...mockData_1.mockUsers];
exports.useAuthStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async (email, password) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = users.find(u => u.email === email && u.password === password);
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
    register: async (userData) => {
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
        const newUser = {
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
    updateProfile: (updates) => {
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
}), {
    name: 'auth-storage',
    partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
    }),
}));
