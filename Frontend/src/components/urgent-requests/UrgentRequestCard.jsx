import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hospital, User, Droplet, MapPin, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth'; // Corrected: Use named import
import apiClient from '../../services/apiClient';

const urgencyColorSchemes = {
    "Rất khẩn cấp": {
        border: "border-red-500",
        iconBg: "bg-red-100",
        text: "text-red-600",
        pill: "bg-red-100 text-red-700 border-red-300",
        button: "bg-red-600 hover:bg-red-700",
        infoIcon: "text-red-500",
        detailsButton: "text-red-600 border border-red-200 hover:bg-red-50",
    },
    "Khẩn cấp": {
        border: "border-yellow-500",
        iconBg: "bg-yellow-100",
        text: "text-yellow-600",
        pill: "bg-yellow-100 text-yellow-700 border-yellow-300",
        button: "bg-yellow-500 hover:bg-yellow-600",
        infoIcon: "text-yellow-500",
        detailsButton: "text-yellow-600 border border-yellow-200 hover:bg-yellow-50",
    },
    "Cần thiết": {
        border: "border-blue-500",
        iconBg: "bg-blue-100",
        text: "text-blue-600",
        pill: "bg-blue-100 text-blue-700 border-blue-300",
        button: "bg-blue-500 hover:bg-blue-600",
        infoIcon: "text-blue-500",
        detailsButton: "text-blue-600 border border-blue-200 hover:bg-blue-50",
    },
    "default": {
        border: "border-gray-400",
        iconBg: "bg-gray-100",
        text: "text-gray-600",
        pill: "bg-gray-100 text-gray-700 border-gray-300",
        button: "bg-gray-500 hover:bg-gray-600",
        infoIcon: "text-gray-500",
        detailsButton: "text-gray-600 border border-gray-200 hover:bg-gray-50",
    }
};

const InfoRow = ({ icon: Icon, text, iconColorClass }) => (
    <div className="flex items-start text-gray-600 mb-2">
        <Icon size={16} className={`mr-3 mt-1 flex-shrink-0 ${iconColorClass}`} />
        <span className="flex-grow">{text}</span>
    </div>
);

const UrgentRequestCard = ({ request, onViewDetails }) => {
    const { 
        bloodType, 
        bloodRh, 
        hospital, 
        patientName, 
        patientGender, 
        patientAge, 
        unitsNeeded, 
        location, 
        reason, 
        urgency, 
        requestDate 
    } = request;

    const colorScheme = urgencyColorSchemes[urgency] || urgencyColorSchemes.default;

    const formattedDate = new Date(requestDate).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleVolunteerClick = async (e) => {
        e.stopPropagation(); // Prevent card's onClick from firing

        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để thực hiện chức năng này.');
            navigate('/login');
            return;
        }

        const isConfirmed = window.confirm(
            `Bạn có chắc chắn muốn đăng ký hiến máu cho bệnh nhân ${patientName} không?`
        );

        if (isConfirmed) {
            const toastId = toast.loading('Đang xử lý yêu cầu của bạn...');
            try {
                // Mock API call
                await apiClient.post(`/urgent-requests/${request.id}/volunteer`);
                
                toast.success(
                    `Đăng ký thành công! Cảm ơn lòng tốt của bạn. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.`,
                    { id: toastId, duration: 6000 }
                );
            } catch (error) {
                toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.', { id: toastId });
                console.error("Volunteer registration failed:", error);
            }
        }
    };

    return (
        <div 
            className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-4 ${colorScheme.border} relative mb-6 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer`}
            onClick={onViewDetails}
        >
            <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border ${colorScheme.pill}`}>
                {urgency}
            </div>
            <div className="p-5">
                <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full mr-4 ${colorScheme.iconBg}`}>
                        <Droplet size={24} className={colorScheme.text} />
                    </div>
                    <div>
                        <h3 className={`text-2xl font-bold ${colorScheme.text}`}>{bloodType} <span className="font-normal text-lg">{bloodRh}</span></h3>
                        <p className="text-gray-500 flex items-center"><Hospital size={14} className="mr-2"/>{hospital}</p>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <InfoRow icon={User} text={`Bệnh nhân: ${patientName} (${patientGender}, ${patientAge} tuổi)`} iconColorClass={colorScheme.infoIcon} />
                    <InfoRow icon={Droplet} text={`Cần: ${unitsNeeded} đơn vị máu`} iconColorClass={colorScheme.infoIcon} />
                    <InfoRow icon={MapPin} text={`Địa điểm: ${location}`} iconColorClass={colorScheme.infoIcon} />
                </div>

                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md my-4 border-l-2 border-gray-300">
                    {reason}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                        <Clock size={14} className="mr-1.5" />
                        <span>Yêu cầu: {formattedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                         <button 
                            onClick={onViewDetails} // Changed this to use the passed onViewDetails prop
                            className={`flex items-center space-x-1.5 font-semibold py-2 px-3 rounded-lg transition-colors text-xs ${colorScheme.detailsButton}`}
                        >
                            <span>Chi tiết</span>
                            <ArrowRight size={14} />
                        </button>
                        <button 
                            onClick={handleVolunteerClick}
                            className={`flex items-center text-white font-bold py-2 px-4 rounded-lg ${colorScheme.button} transition-colors shadow-md`}
                        >
                            <ShieldAlert size={14} className="inline-block mr-1.5 mb-0.5"/> 
                            <span>Tình nguyện</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrgentRequestCard;
