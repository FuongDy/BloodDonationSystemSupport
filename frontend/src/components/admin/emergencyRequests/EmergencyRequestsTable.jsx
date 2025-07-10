// src/components/admin/emergencyRequests/EmergencyRequestsTable.jsx
import React, { useState } from 'react';
import { AlertTriangle, User, Clock, Eye } from 'lucide-react';
import Button from '../../common/Button';
import EmergencyDonorsModal from './EmergencyDonorsModal';

const EmergencyRequestsTable = ({ 
  filteredRequests, 
  getStatusColor, 
  getStatusText, 
  onStatusUpdate 
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDonorsModal, setShowDonorsModal] = useState(false);

  const handleViewDonors = (request) => {
    setSelectedRequest(request);
    setShowDonorsModal(true);
  };

  const handleCloseDonorsModal = () => {
    setShowDonorsModal(false);
    setSelectedRequest(null);
  };
  if (filteredRequests.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='text-center py-12'>
          <AlertTriangle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Không có yêu cầu khẩn cấp
          </h3>
          <p className='text-gray-600'>
            Chưa có yêu cầu hiến máu khẩn cấp nào được tạo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Bệnh nhân
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Nhóm máu
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Bệnh viện
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Số lượng
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Đã đăng ký
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Trạng thái
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Ngày tạo
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredRequests.map(request => (
              <tr key={request.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <User className='w-4 h-4 text-gray-400 mr-2' />
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {request.patientName || 'N/A'}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {request.contactPhone || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                    {typeof request.bloodType === 'object' 
                      ? request.bloodType.bloodGroup || 'N/A'
                      : (request.bloodType || 'N/A')}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {request.hospital || 'N/A'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {request.quantityInUnits || 0} đơn vị
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className={`text-sm font-medium ${
                      request.pledgeCount >= request.quantityInUnits 
                        ? 'text-green-600' 
                        : 'text-gray-900'
                    }`}>
                      {request.pledgeCount || 0}
                    </div>
                    {request.pledgeCount >= request.quantityInUnits && (
                      <div className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đủ
                      </div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                  >
                    {getStatusText(request.status)}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  <div className='flex items-center'>
                    <Clock className='w-4 h-4 mr-1' />
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex items-center justify-end space-x-2'>
                    {/* Nút xem chi tiết người hiến máu */}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleViewDonors(request)}
                      title='Xem danh sách người đã hiến máu'
                    >
                      <Eye className='w-4 h-4 mr-1' />
                      Chi tiết
                    </Button>
                    
                    {request.status === 'PENDING' && (
                      <>
                        <Button
                          variant={request.pledgeCount >= request.quantityInUnits ? 'primary' : 'outline'}
                          size='sm'
                          onClick={() => onStatusUpdate(request.id, 'FULFILLED')}
                          title={request.pledgeCount >= request.quantityInUnits 
                            ? 'Đã đủ người đăng ký, có thể hoàn thành yêu cầu' 
                            : 'Đánh dấu yêu cầu đã hoàn thành'
                          }
                        >
                          {request.pledgeCount >= request.quantityInUnits ? 'Đánh dấu hoàn thành' : 'Hoàn thành'}
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => onStatusUpdate(request.id, 'CANCELLED')}
                        >
                          Hủy
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal hiển thị danh sách người hiến máu */}
      <EmergencyDonorsModal
        isOpen={showDonorsModal}
        onClose={handleCloseDonorsModal}
        requestId={selectedRequest?.id}
        requestData={selectedRequest}
      />
    </div>
  );
};

export default EmergencyRequestsTable;
