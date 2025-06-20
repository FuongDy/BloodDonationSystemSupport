import React from 'react';
import { Hospital, User, Droplet, MapPin, Clock, ShieldAlert } from 'lucide-react';

const urgencyColorSchemes = {
    "Rất khẩn cấp": {
        border: "border-red-500",
        iconBg: "bg-red-100",
        text: "text-red-600",
        pill: "bg-red-100 text-red-700 border-red-300",
        button: "bg-red-600 hover:bg-red-700",
        infoIcon: "text-red-500",
    },
    "Khẩn cấp": {
        border: "border-yellow-500",
        iconBg: "bg-yellow-100",
        text: "text-yellow-600",
        pill: "bg-yellow-100 text-yellow-700 border-yellow-300",
        button: "bg-yellow-500 hover:bg-yellow-600",
        infoIcon: "text-yellow-500",
    },
    "Cần thiết": {
        border: "border-blue-500",
        iconBg: "bg-blue-100",
        text: "text-blue-600",
        pill: "bg-blue-100 text-blue-700 border-blue-300",
        button: "bg-blue-500 hover:bg-blue-600",
        infoIcon: "text-blue-500",
    },
    "default": {
        border: "border-gray-400",
        iconBg: "bg-gray-100",
        text: "text-gray-600",
        pill: "bg-gray-100 text-gray-700 border-gray-300",
        button: "bg-gray-500 hover:bg-gray-600",
        infoIcon: "text-gray-500",
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

    const handleVolunteerClick = (e) => {
        e.stopPropagation(); // Ngăn không cho modal mở ra khi bấm nút này
        // Thêm logic xử lý tình nguyện ở đây
        console.log(`Đăng ký tình nguyện cho: ${request.patientName}`);
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
                    <div className="flex space-x-2">
                        <button 
                            onClick={handleVolunteerClick}
                            className={`text-white font-bold py-2 px-4 rounded-lg ${colorScheme.button} transition-colors shadow-md`}
                        >
                            <ShieldAlert size={14} className="inline-block mr-1.5 mb-0.5"/> Tình nguyện
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrgentRequestCard;
