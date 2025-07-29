// src/store/index.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Global Application Store
 * Manages global state including notifications, loading states, and UI preferences
 */

// Notification slice
const createNotificationSlice = set => ({
  notifications: [],

  /**
   * Add a new notification to the global notification list
   * @param {Object} notification - Notification object
   * @param {string} notification.id - Unique identifier
   * @param {string} notification.type - Type: 'success', 'error', 'warning', 'info'
   * @param {string} notification.message - Notification message
   * @param {number} notification.duration - Auto-dismiss duration in ms
   */
  addNotification: notification =>
    set(
      state => ({
        notifications: [
          ...state.notifications,
          {
            id: Date.now() + Math.random(),
            type: 'info',
            duration: 1500,
            ...notification,
          },
        ],
      }),
      false,
      'addNotification'
    ),

  /**
   * Remove notification by ID
   * @param {string} id - Notification ID to remove
   */
  removeNotification: id =>
    set(
      state => ({
        notifications: state.notifications.filter(n => n.id !== id),
      }),
      false,
      'removeNotification'
    ),

  /**
   * Mark notification as shown to prevent duplicate toasts
   * @param {string} id - Notification ID
   */
  markNotificationAsShown: id =>
    set(
      state => ({
        notifications: state.notifications.map(notification =>
          notification.id === id
            ? { ...notification, shown: true }
            : notification
        ),
      }),
      false,
      'markNotificationAsShown'
    ),

  /**
   * Clear all notifications
   */
  clearNotifications: () =>
    set({ notifications: [] }, false, 'clearNotifications'),
});

// Loading slice
const createLoadingSlice = set => ({
  loading: {},

  /**
   * Set loading state for a specific operation
   * @param {string} key - Loading key identifier
   * @param {boolean} isLoading - Loading state
   */
  setLoading: (key, isLoading) =>
    set(
      state => ({
        loading: {
          ...state.loading,
          [key]: isLoading,
        },
      }),
      false,
      'setLoading'
    ),

  /**
   * Check if any loading state is active
   * @returns {boolean} True if any loading state is active
   */
  isAnyLoading: () => {
    const state = useAppStore.getState();
    return Object.values(state.loading).some(Boolean);
  },
});

// UI Preferences slice
const createUISlice = set => ({
  sidebarCollapsed: false,
  theme: 'light',

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar: () =>
    set(
      state => ({ sidebarCollapsed: !state.sidebarCollapsed }),
      false,
      'toggleSidebar'
    ),

  /**
   * Set theme preference
   * @param {string} theme - Theme name: 'light' | 'dark'
   */
  setTheme: theme => set({ theme }, false, 'setTheme'),
});

// Error slice
const createErrorSlice = set => ({
  errors: [],

  /**
   * Add error to global error list
   * @param {Object} error - Error object
   * @param {string} error.message - Error message
   * @param {string} error.code - Error code
   * @param {string} error.source - Error source (component/service name)
   */
  addError: error =>
    set(
      state => ({
        errors: [
          ...state.errors,
          {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            ...error,
          },
        ],
      }),
      false,
      'addError'
    ),

  /**
   * Remove error by ID
   * @param {string} id - Error ID to remove
   */
  removeError: id =>
    set(
      state => ({
        errors: state.errors.filter(e => e.id !== id),
      }),
      false,
      'removeError'
    ),

  /**
   * Clear all errors
   */
  clearErrors: () => set({ errors: [] }, false, 'clearErrors'),
});

/**
 * Main Application Store
 * Combines all slices with persistence and devtools support
 */
export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...createNotificationSlice(set, get),
        ...createLoadingSlice(set, get),
        ...createUISlice(set, get),
        ...createErrorSlice(set, get),
      }),
      {
        name: 'blood-donation-app-store',
        partialize: state => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'blood-donation-store',
    }
  )
);

// Selectors for optimized subscriptions
export const useNotifications = () => useAppStore(state => state.notifications);
export const useLoading = key =>
  useAppStore(state => state.loading[key] || false);
export const useTheme = () => useAppStore(state => state.theme);
export const useSidebarCollapsed = () =>
  useAppStore(state => state.sidebarCollapsed);
export const useErrors = () => useAppStore(state => state.errors);

// Helper function for show notification (convenience wrapper)
export const showNotification = (message, type = 'info', duration = 5000) => {
  const addNotification = useAppStore.getState().addNotification;
  addNotification({
    message,
    type,
    duration,
    timestamp: Date.now(),
  });
};

// Legacy export for backward compatibility
export const useUIStore = useAppStore;
