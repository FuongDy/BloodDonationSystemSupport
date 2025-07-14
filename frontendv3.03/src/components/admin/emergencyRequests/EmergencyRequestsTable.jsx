// src/components/admin/emergencyRequests/EmergencyRequestsTable.jsx
import React, { useState } from 'react';
import { AlertTriangle, User, Clock, Eye, Bed } from 'lucide-react';
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
                Mức độ <br/> khẩn cấp
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Vị trí
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
                        {request.contactPhone || 
                         request.phone || 
                         request.createdBy?.phone || 
                         request.createdBy?.emergencyContact || 
                         request.emergencyContact || 
                         'N/A'}
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
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    request.urgency === 'URGENT' ? 'bg-orange-100 text-orange-800' :
                    request.urgency === 'NORMAL' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <AlertTriangle className='w-3 h-3 mr-1' />
                    {request.urgency === 'CRITICAL' ? 'Rất khẩn cấp' :
                     request.urgency === 'URGENT' ? 'Khẩn cấp' :
                     request.urgency === 'NORMAL' ? 'Bình thường' : 'N/A'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  <div className='space-y-1'>
                    {/* Bệnh viện */}
                    <div className='font-medium text-gray-900'>
                      {request.hospital || 'N/A'}
                    </div>
                    {/* Phòng - Giường */}
                    <div className='flex items-center space-x-2'>
                      {request.roomNumber || request.bedNumber ? (
                        <>
                          {request.roomNumber && (
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                              <Bed className='w-3 h-3 mr-1' />
                              P.{request.roomNumber}
                            </span>
                          )}
                          {request.bedNumber && (
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'>
                              <Bed className='w-3 h-3 mr-1' />
                              G.{request.bedNumber}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className='text-xs text-gray-400'>Chưa có thông tin phòng/giường</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {request.quantityInUnits || 0} đơn vị
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      request.pledgeCount >= request.quantityInUnits 
                        ? 'text-green-600' 
                        : 'text-gray-900'
                    }`}>
                      {request.pledgeCount || 0} / {request.quantityInUnits || 0}
                    </div>
                    {request.pledgeCount >= request.quantityInUnits && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        ✓ Đã đủ người đăng ký
                      </div>
                    )}
                    {request.pledgeCount < request.quantityInUnits && (
                      <div className="text-xs text-orange-600 mt-1">
                        Cần thêm {(request.quantityInUnits || 0) - (request.pledgeCount || 0)} người
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
                          variant={request.pledgeCount >= request.quantityInUnits ? 'primary' : 'secondary'}
                          size='sm'
                          onClick={() => onStatusUpdate(request.id, 'FULFILLED')}
                          title={request.pledgeCount >= request.quantityInUnits 
                            ? 'Đã có đủ người đăng ký hiến máu. Nhấn để đánh dấu hoàn thành yêu cầu này.' 
                            : 'Đánh dấu yêu cầu đã hoàn thành (dù chưa đủ người đăng ký)'
                          }
                        >
                          {request.pledgeCount >= request.quantityInUnits ? (
                            <>
                              ✓ Hoàn thành
                            </>
                          ) : (
                            'Hoàn thành'
                          )}
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => onStatusUpdate(request.id, 'CANCELLED')}
                          title='Hủy yêu cầu này'
                        >
                          Hủy yêu cầu
                        </Button>
                      </>
                    )}
                    
                    {(request.status === 'FULFILLED' || request.status === 'COMPLETED') && (
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Đã hoàn thành
                      </div>
                    )}
                    
                    {request.status === 'CANCELLED' && (
                      <div className="text-sm text-red-600 font-medium">
                        ✗ Đã hủy
                      </div>
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
