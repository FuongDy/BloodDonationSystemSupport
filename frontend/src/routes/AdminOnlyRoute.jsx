// src/routes/AdminOnlyRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If user is not Admin, redirect to first allowed page for Staff
  if (user?.role === 'Staff') {
    return <Navigate to="/admin/emergency-requests" replace />;
  }

  // If user is Admin, render the component
  return children;
};

export default AdminOnlyRoute;
