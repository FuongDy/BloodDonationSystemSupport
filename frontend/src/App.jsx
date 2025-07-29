// src/App.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAppStore } from './store/appStore';

const queryClient = new QueryClient();

/**
 * Notification Manager Component
 *
 * Component để quản lý hiển thị notifications từ Zustand store
 * sử dụng react-hot-toast
 */
const NotificationManager = () => {
  const { notifications, removeNotification } = useAppStore();

  React.useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.shown) {
        // Mark as shown trước khi show để tránh duplicate
        useAppStore.getState().markNotificationAsShown(notification.id);

        const commonOptions = {
          id: notification.id,
          duration: notification.duration || 1500,
        };

        // Show toast dựa trên type với enhanced error handling
        switch (notification.type) {
          case 'error':
            toast.error(notification.message, {
              ...commonOptions,
              duration: notification.duration || 1500,
            });
            break;
          case 'success':
            toast.success(notification.message, commonOptions);
            break;
          case 'warning':
            toast(notification.message, {
              ...commonOptions,
              icon: '⚠️',
            });
            break;
          default:
            toast(notification.message, commonOptions);
        }

        // Clean up notification
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || 3000);
      }
    });
  }, [notifications, removeNotification]);

  return null;
};

/**
 * Main App Component
 *
 * Root component với ErrorBoundary, providers, và global state management.
 * Bao gồm QueryClient cho data fetching, AuthProvider cho authentication,
 * và notification system với Zustand store.
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position='top-center'
            reverseOrder={false}
            toastOptions={{
              duration: 1500,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 1500,
                theme: {
                  primary: '#10b981',
                  secondary: '#black',
                },
              },
              error: {
                duration: 1500,
                theme: {
                  primary: '#ef4444',
                  secondary: '#black',
                },
              },
            }}
          />
          <NotificationManager />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
