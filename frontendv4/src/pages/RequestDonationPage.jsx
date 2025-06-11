import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, MapPin, MessageSquare, Send } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import appointmentService from '../services/appointmentService';

const RequestDonationPage = () => {
    const [formData, setFormData] = useState({
        appointmentDate: '',
        location: 'Trung tâm hiến máu TP.HCM (201 Nguyễn Thị Minh Khai, Q1)',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.appointmentDate || !formData.location) {
            toast.error("Vui lòng chọn ngày hẹn và địa điểm.");
            return;
        }
        setLoading(true);
        try {
            await appointmentService.requestDonationAppointment(formData);
            toast.success("Gửi yêu cầu đặt lịch hẹn thành công! Chúng tôi sẽ sớm liên hệ với bạn.");
            navigate('/profile'); // Chuyển về trang cá nhân sau khi thành công
        } catch (error) {
            toast.error(error.response?.data?.message || "Gửi yêu cầu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="container mx-auto max-w-2xl py-12 px-4">
                <div className="text-center mb-8">
                    <Calendar className="mx-auto h-12 w-auto text-red-600" />
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Đặt Lịch Hẹn Hiến Máu
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Chủ động chọn thời gian và địa điểm phù hợp để việc hiến máu trở nên dễ dàng hơn.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            label="Chọn ngày giờ hẹn"
                            id="appointmentDate"
                            name="appointmentDate"
                            type="datetime-local"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            icon={<Calendar size={20} />}
                        />
                        <InputField
                            label="Địa điểm"
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            icon={<MapPin size={20} />}
                        />
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="4"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    placeholder="Ví dụ: Tôi có thể đến sau 18:00..."
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            isLoading={loading}
                            variant="primary"
                            size="lg"
                        >
                            <Send className="mr-2 h-5 w-5" />
                            Gửi Yêu Cầu
                        </Button>
                    </form>
                </div>
            </div>
    );
};

export default RequestDonationPage;