// src/pages/admin/AdminUserEditPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

import AdminUserForm from '../../components/admin/AdminUserForm';

const AdminUserEditPage = () => {
  const { userId } = useParams();

  return <AdminUserForm userId={userId} mode="edit" />;
};

export default AdminUserEditPage;

