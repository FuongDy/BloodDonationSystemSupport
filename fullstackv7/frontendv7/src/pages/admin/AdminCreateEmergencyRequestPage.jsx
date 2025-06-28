// src/pages/admin/AdminCreateEmergencyRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import bloodRequestService from '../../services/bloodRequestService';
import bloodTypeService from '../../services/bloodTypeService';
import { HOSPITAL_INFO } from '../../utils/constants';

const AdminCreateEmergencyRequestPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodTypeId: '',
    hospital: HOSPITAL_INFO.FULL_NAME, // Sử dụng giá trị mặc định từ constants
    quantityInUnits: 1,
    urgency: 'URGENT', // Sử dụng giá trị enum đúng của backend: NORMAL, URGENT, CRITICAL
    contactPhone: '', // Sẽ không gửi những trường này lên backend
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchBloodTypes();
  }, []);

  const fetchBloodTypes = async () => {
    try {
      setIsLoading(true);
      const response = await bloodTypeService.getAll();
      
      // Xử lý trùng lặp: Lọc các nhóm máu trùng lặp, chỉ giữ lại một
      // Tạo một Map dựa trên bloodGroup để loại bỏ trùng lặp
      const uniqueBloodTypes = [];
      const bloodGroupMap = new Map();
      
      // Ưu tiên loại máu toàn phần (WHOLE_BLOOD) nếu có
      response?.forEach(type => {
        if (!bloodGroupMap.has(type.bloodGroup) || type.componentType === 'WHOLE_BLOOD') {
          bloodGroupMap.set(type.bloodGroup, type);
        }
      });
      
      // Chuyển Map thành array
      bloodGroupMap.forEach((value) => {
        uniqueBloodTypes.push(value);
      });
      
      // Sắp xếp theo thứ tự A, B, AB, O
      uniqueBloodTypes.sort((a, b) => {
        const order = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        return order.indexOf(a.bloodGroup) - order.indexOf(b.bloodGroup);
      });
      
      setBloodTypes(uniqueBloodTypes || []);
    } catch (error) {
      console.error('Error fetching blood types:', error);
      toast.error('Không thể tải danh sách nhóm máu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName.trim()) {
      errors.patientName = 'Tên bệnh nhân là bắt buộc';
    }
    if (!formData.bloodTypeId) {
      errors.bloodTypeId = 'Nhóm máu là bắt buộc';
    }
    if (!formData.hospital.trim()) {
      errors.hospital = 'Bệnh viện là bắt buộc';
    }
    if (formData.quantityInUnits < 1) {
      errors.quantityInUnits = 'Số lượng phải ít nhất 1 đơn vị';
    }
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = 'Số điện thoại liên hệ là bắt buộc';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    try {
      setIsSubmitting(true);
        // Create a new emergency request - chỉ lấy các trường mà backend yêu cầu
      const requestPayload = {
        patientName: formData.patientName,
        hospital: formData.hospital,
        bloodTypeId: Number(formData.bloodTypeId),
        quantityInUnits: Number(formData.quantityInUnits),
        urgency: formData.urgency, // Đảm bảo đây là một giá trị enum hợp lệ (URGENT hoặc CRITICAL)
      };
      
      await bloodRequestService.createEmergencyRequest(requestPayload);
      
      toast.success('Tạo yêu cầu khẩn cấp thành công');
      navigate('/admin/emergency-requests');
    } catch (error) {
      console.error('Error creating emergency request:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from the server
        const serverErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          serverErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setFormErrors(serverErrors);
      }
      
      toast.error(
        error.response?.data?.message || 
        'Không thể tạo yêu cầu khẩn cấp. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="12" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tạo yêu cầu khẩn cấp mới
            </h1>
            <p className="text-gray-600 mt-1">
              Thêm một yêu cầu hiến máu khẩn cấp mới vào hệ thống
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/emergency-requests')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <p className="text-sm text-red-700">
                  Đây là yêu cầu khẩn cấp với mức độ ưu tiên cao. 
                  Hệ thống sẽ tự động thông báo đến người dùng.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div>
              <InputField
                label="Tên bệnh nhân"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="Nhập tên bệnh nhân"
                required
                error={formErrors.patientName}
              />
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm máu <span className="text-red-500">*</span>
              </label>
              <select
                name="bloodTypeId"
                value={formData.bloodTypeId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  formErrors.bloodTypeId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              >
                <option value="">-- Chọn nhóm máu --</option>
                {bloodTypes.map(bloodType => (
                  <option key={bloodType.id} value={bloodType.id}>
                    {bloodType.bloodGroup} {bloodType.componentType === 'WHOLE_BLOOD' ? '(Máu toàn phần)' : ''}
                  </option>
                ))}
              </select>
              {formErrors.bloodTypeId && (
                <p className="mt-1 text-sm text-red-600">{formErrors.bloodTypeId}</p>
              )}
            </div>

            {/* Hospital */}
            <div>
              <InputField
                label="Bệnh viện"
                name="hospital"
                value={formData.hospital}
                onChange={handleInputChange}
                placeholder="Tên bệnh viện"
                required
                error={formErrors.hospital}
              />
            </div>

            {/* Quantity */}
            <div>
              <InputField
                label="Số lượng (đơn vị)"
                name="quantityInUnits"
                type="number"
                min="1"
                value={formData.quantityInUnits}
                onChange={handleInputChange}
                required
                error={formErrors.quantityInUnits}
              />
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức độ khẩn cấp <span className="text-red-500">*</span>
              </label>              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="CRITICAL">Rất khẩn cấp</option>
                <option value="URGENT">Khẩn cấp</option>
                <option value="NORMAL">Bình thường</option>
              </select>
            </div>

            {/* Contact Phone */}
            <div>
              <InputField
                label="Số điện thoại liên hệ"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Số điện thoại liên hệ"
                required
                error={formErrors.contactPhone}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú bổ sung
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Nhập ghi chú hoặc thông tin bổ sung về yêu cầu này (nếu có)"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="4" className="mr-2" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Tạo yêu cầu
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
};

export default AdminCreateEmergencyRequestPage;
