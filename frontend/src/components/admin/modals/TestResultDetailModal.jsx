// src/components/admin/modals/TestResultDetailModal.jsx
import { Activity, CheckCircle, Clock, FileText, FlaskConical, Heart, TestTube, User, XCircle } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatters';
import DonationTypeBadge from '../../common/DonationTypeBadge';
import Modal from '../../common/Modal';
import StatusBadge from '../../common/StatusBadge';

const TestResultDetailModal = ({ 
  isOpen, 
  onClose, 
  testResult 
}) => {
  if (!testResult) return null;

  // Get the correct isSafe value from different possible data structures
  const getIsSafeValue = () => {
    // First check if we have direct isSafe field
    if (testResult.isSafe !== undefined && testResult.isSafe !== null) {
      return testResult.isSafe;
    }
    
    // Check nested testResult
    if (testResult.testResult?.isSafe !== undefined && testResult.testResult?.isSafe !== null) {
      return testResult.testResult.isSafe;
    }
    
    // Fallback based on status - this is how backend actually works
    if (testResult.status === 'COMPLETED' || testResult.status === 'TESTING_PASSED') {
      return true; // Blood test passed - safe to use
    }
    if (testResult.status === 'TESTING_FAILED') {
      return false; // Blood test failed - not safe to use
    }
    
    // If status is BLOOD_COLLECTED, test hasn't been done yet
    if (testResult.status === 'BLOOD_COLLECTED') {
      return null; // Pending test
    }
    
    return null; // Unknown status
  };

  const isSafe = getIsSafeValue();

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'PASSED':
        return 'success';
      case 'TESTING_FAILED':
      case 'FAILED':
        return 'error';
      case 'BLOOD_COLLECTED':
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTestResultIcon = () => {
    if (isSafe === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (isSafe === false) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết kết quả xét nghiệm"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header với trạng thái */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Kết quả xét nghiệm #{testResult.id}
            </h3>
            <p className="text-sm text-gray-500">
              Thực hiện lúc {formatDateTime(testResult.testDate || testResult.createdAt || testResult.updatedAt)}
            </p>
          </div>
          <StatusBadge 
            status={testResult.overallStatus || testResult.status || testResult.testStatus} 
            variant={getStatusColor(testResult.overallStatus || testResult.status || testResult.testStatus)} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin người hiến máu */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="flex items-center text-md font-medium text-gray-900 mb-3">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Thông tin người hiến máu
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Họ và tên:</label>
                <p className="text-sm text-gray-900">{testResult.donationProcess?.donor?.fullName || testResult.donor?.fullName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nhóm máu:</label>
                <p className="text-sm font-semibold text-red-600 flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  {testResult.donationProcess?.donor?.bloodType || testResult.donor?.bloodType || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Thể tích thu thập:</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <FlaskConical className="w-4 h-4 mr-1 text-blue-500" />
                  {testResult.collectedVolumeMl || testResult.volumeCollected || 'N/A'} ml
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Loại đơn:</label>
                <div className="mt-1">
                  <DonationTypeBadge type={testResult.donationProcess?.donationType || testResult.donationType} />
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin phòng xét nghiệm */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="flex items-center text-md font-medium text-gray-900 mb-3">
              <TestTube className="w-5 h-5 mr-2 text-purple-500" />
              Thông tin xét nghiệm
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Phòng xét nghiệm:</label>
                <p className="text-sm text-gray-900">{testResult.laboratoryName || testResult.labName || 'Phòng XN Trung tâm hiến máu'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày xét nghiệm:</label>
                <p className="text-sm text-gray-900">{formatDateTime(testResult.testDate || testResult.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày có kết quả:</label>
                <p className="text-sm text-gray-900">{formatDateTime(testResult.resultDate || testResult.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kết quả xét nghiệm */}
        <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <TestTube className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Kết quả xét nghiệm</h3>
          </div>
          
          <div className="space-y-3">
            {/* Tình trạng máu */}
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-2">
                {getTestResultIcon()}
                <span className="font-medium">Tình trạng máu:</span>
              </div>
              <StatusBadge 
                status={isSafe === true ? 'An toàn' : isSafe === false ? 'Không an toàn' : 'Chưa xác định'} 
                variant={isSafe === true ? 'success' : isSafe === false ? 'error' : 'warning'} 
              />
            </div>

            {/* Kết quả tổng quát */}
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="font-medium">Đánh giá:</span>
              </div>
              <p className="text-gray-700 ml-6">
                {isSafe === true
                  ? 'Máu đạt tiêu chuẩn chất lượng và an toàn để sử dụng.'
                  : isSafe === false
                  ? 'Máu không đạt tiêu chuẩn chất lượng và không thể sử dụng.'
                  : 'Chưa có kết quả xác định về tình trạng máu.'
                }
              </p>
            </div>

            {/* Trạng thái xét nghiệm */}
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="font-medium">Trạng thái:</span>
              </div>
              <StatusBadge 
                status={testResult.status || 'PENDING'} 
                variant={getStatusColor(testResult.status || 'PENDING')} 
              />
            </div>
          </div>
        </div>
        {/* Ghi chú và kết luận */}
        {(testResult.notes || testResult.overallNotes) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="flex items-center text-md font-medium text-gray-900 mb-3">
              <FileText className="w-5 h-5 mr-2 text-indigo-500" />
              Ghi chú
            </h4>
            <p className="text-sm text-gray-700">
              {testResult.notes || testResult.overallNotes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TestResultDetailModal;
