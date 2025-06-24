// src/components/admin/TestResultForm.jsx
import React, { useState } from 'react';
import { TestTube, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import donationService from '../../services/donationService';
import toast from 'react-hot-toast';

const TestResultForm = ({ 
  processId, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    isSafe: true,
    bloodUnitId: '',
    testResults: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!processId) {
      toast.error('Không có ID quy trình');
      return;
    }

    if (!formData.bloodUnitId.trim()) {
      toast.error('Vui lòng nhập mã đơn vị máu');
      return;
    }

    setIsSubmitting(true);
    try {
      await donationService.recordBloodTestResult(processId, formData);
      toast.success('Ghi nhận kết quả xét nghiệm thành công');
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        isSafe: true,
        bloodUnitId: '',
        testResults: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error recording test result:', error);
      toast.error('Không thể ghi nhận kết quả xét nghiệm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ghi nhận kết quả xét nghiệm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center mb-4">
          <TestTube className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-sm text-gray-600">
            Ghi nhận kết quả xét nghiệm máu
          </span>
        </div>

        <InputField
          label="Mã đơn vị máu"
          type="text"
          name="bloodUnitId"
          value={formData.bloodUnitId}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          placeholder="VD: BU202512251234"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Kết quả xét nghiệm
          </label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="isSafe"
                value={true}
                checked={formData.isSafe === true}
                onChange={() => setFormData(prev => ({ ...prev, isSafe: true }))}
                disabled={isSubmitting}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <CheckCircle className="w-4 h-4 text-green-600 ml-2 mr-1" />
              <span className="text-sm text-green-700">An toàn</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isSafe"
                value={false}
                checked={formData.isSafe === false}
                onChange={() => setFormData(prev => ({ ...prev, isSafe: false }))}
                disabled={isSubmitting}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <XCircle className="w-4 h-4 text-red-600 ml-2 mr-1" />
              <span className="text-sm text-red-700">Không an toàn</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chi tiết kết quả xét nghiệm
          </label>
          <textarea
            name="testResults"
            value={formData.testResults}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="VD: HIV (-), HBV (-), HCV (-), Syphilis (-)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú thêm
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập ghi chú thêm về kết quả xét nghiệm..."
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant={formData.isSafe ? "success" : "warning"}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            <TestTube className="w-4 h-4 mr-2" />
            Lưu kết quả
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TestResultForm;


