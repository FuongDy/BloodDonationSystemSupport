// import React from 'react';
// import BloodTypeFormModal from '../../components/admin/BloodTypeFormModal';
// import AdminPageLayout from '../../components/admin/AdminPageLayout';
// import { BloodTypePageHeader, BloodTypeTabsContainer } from '../../components/admin/bloodTypes';
// import { useBloodTypePageLogic } from '../../hooks/useBloodTypePageLogic';
// import { useAuth } from '../../hooks/useAuth';

// const AdminBloodTypePage = () => {
//   const { user } = useAuth();
//   const {
//     isLoading,
//     isModalOpen,
//     editingBloodType,
//     activeTab,
//     groupedBloodTypes,
//     handleOpenModal,
//     handleCloseModal,
//     handleSaveSuccess,
//     handleDelete,
//     setActiveTab,
//   } = useBloodTypePageLogic();

//   const isAdmin = user?.roles?.includes('ROLE_ADMIN');
//   const { headerActions } = BloodTypePageHeader({
//     onAddNew: () => handleOpenModal(),
//     isAdmin,
//     isLoading,
//   });

//   return (
//     <AdminPageLayout title='Quản lý Loại máu' actions={headerActions}>
//       <BloodTypeTabsContainer
//         groupedBloodTypes={groupedBloodTypes}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         onEdit={handleOpenModal}
//         onDelete={handleDelete}
//         canEdit={isAdmin}
//         isLoading={isLoading}
//       />

//       <BloodTypeFormModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSaveSuccess={handleSaveSuccess}
//         bloodType={editingBloodType}
//       />
//     </AdminPageLayout>
//   );
// };

// export default AdminBloodTypePage;
