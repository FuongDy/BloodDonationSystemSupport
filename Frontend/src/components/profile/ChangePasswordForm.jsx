import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { userService } from '../../services/userService';
import { toast } from 'react-hot-toast';

const ChangePasswordForm = () => {
  const { values, handleChange } = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (values.newPassword !== values.confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      return;
    }
    if (values.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      // Reset form
      handleChange({ target: { name: 'currentPassword', value: '' } });
      handleChange({ target: { name: 'newPassword', value: '' } });
      handleChange({ target: { name: 'confirmPassword', value: '' } });
    } catch (err) {
      const errorMessage = err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
      <InputField
        label="Mật khẩu hiện tại"
        type="password"
        name="currentPassword"
        value={values.currentPassword}
        onChange={handleChange}
        required
        placeholder="••••••••"
      />
      <InputField
        label="Mật khẩu mới"
        type="password"
        name="newPassword"
        value={values.newPassword}
        onChange={handleChange}
        required
        placeholder="••••••••"
      />
      <InputField
        label="Xác nhận mật khẩu mới"
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange}
        required
        placeholder="••••••••"
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
