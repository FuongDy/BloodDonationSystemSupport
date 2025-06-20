// src/pages/admin/AdminUserDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import AdminUserForm from '../../components/admin/AdminUserForm';

const AdminUserDetailPage = () => {
  const { userId } = useParams();

  return <AdminUserForm userId={userId} mode="view" />;
};

export default AdminUserDetailPage;
