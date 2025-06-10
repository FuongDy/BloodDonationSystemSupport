// src/store/index.js
import { create } from 'zustand'; //

// Ví dụ một store đơn giản cho settings UI hoặc notifications
export const useUIStore = create((set) => ({
    theme: 'light', // 'light' or 'dark'
    notifications: [],
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
    removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
}));
