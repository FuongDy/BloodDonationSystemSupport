// src/pages/admin/AdminDonationProcessPageOptimized.jsx
import React from 'react';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import AdminContentWrapper from '../../components/admin/AdminContentWrapper';
import DonationProcessTable from '../../components/admin/DonationProcessTable';
import DonationProcessModals from '../../components/admin/DonationProcessModals';

import { useDonationProcess } from '../../hooks/useDonationProcess';
import { useModalManager } from '../../hooks/useModalManager';

const AdminDonationProcessPage = () => {
  const {
    processes,
    isLoading,
    selectedProcess,
    setSelectedProcess,
    fetchProcesses,
    updateStatus,
    recordHealthCheck,
    markBloodAsCollected,
    recordTestResult,
    createAppointment,
  } = useDonationProcess();

  const { modals, forms, openModal, closeModal, updateForm } =
    useModalManager();

  const handleActionClick = (action, process) => {
    setSelectedProcess(process);

    switch (action) {
      case 'updateStatus':
        openModal('status', process);
        break;
      case 'createAppointment':
        openModal('appointment', process);
        break;
      case 'healthCheck':
        openModal('healthCheck', process);
        break;
      case 'bloodCollection':
        openModal('collection', process);
        break;
      case 'testResult':
        openModal('testResult', process);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleModalClose = modalType => {
    closeModal(modalType);
    setSelectedProcess(null);
  };

  const handleFormChange = (formType, field, value) => {
    updateForm(formType, field, value);
  };

  const handleSubmit = async submitType => {
    if (!selectedProcess) {
      toast.error('Không có quy trình được chọn');
      return;
    }

    let success = false;

    switch (submitType) {
      case 'status':
        if (!forms.statusForm.newStatus) {
          toast.error('Vui lòng chọn trạng thái mới');
          return;
        }
        success = await updateStatus(selectedProcess.id, forms.statusForm);
        break;

      case 'healthCheck':
        success = await recordHealthCheck(
          selectedProcess.id,
          forms.healthCheckForm
        );
        break;

      case 'collection':
        success = await markBloodAsCollected(
          selectedProcess.id,
          forms.collectionForm
        );
        break;

      case 'testResult':
        success = await recordTestResult(
          selectedProcess.id,
          forms.testResultForm
        );
        break;

      case 'appointment': {
        const appointmentData = {
          processId: selectedProcess.id,
          ...forms.appointmentForm,
        };
        success = await createAppointment(appointmentData);
        break;
      }

      default:
        console.warn('Unknown submit type:', submitType);
        return;
    }

    if (success) {
      handleModalClose(submitType);
    }
  };

  const headerActions = [
    {
      label: 'Làm mới',
      icon: Users,
      variant: 'outline',
      onClick: fetchProcesses,
    },
  ];

  return (
    <AdminPageLayout
      title='Quản lý Quy trình Hiến máu'
      description='Theo dõi và quản lý toàn bộ quy trình hiến máu từ đăng ký đến hoàn thành'
      headerActions={headerActions}
    >
      <div className='p-6'>
        <AdminContentWrapper
          isLoading={isLoading}
          hasData={processes.length > 0}
          loadingMessage='Đang tải danh sách quy trình hiến máu...'
          emptyMessage='Chưa có quy trình hiến máu nào'
        >
          <DonationProcessTable
            processes={processes}
            isLoading={isLoading}
            onActionClick={handleActionClick}
          />
        </AdminContentWrapper>

        <DonationProcessModals
          selectedProcess={selectedProcess}
          modals={modals}
          forms={forms}
          onModalClose={handleModalClose}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminPageLayout>
  );
};

export default AdminDonationProcessPage;
