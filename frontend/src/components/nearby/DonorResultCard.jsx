// src/components/nearby/DonorResultCard.jsx
import { Calendar, Droplet, Mail, MapPin } from 'lucide-react';

// Function to get compatible recipients based on donor blood type
const getCompatibleRecipients = (bloodType) => {
    const compatibilityMap = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    };
    
    return compatibilityMap[bloodType]?.join(', ') || 'Chưa xác định';
};

const DonorResultCard = ({ donor, onContact }) => { // Add onContact to props

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start">
                {/* Left side: Info */}
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Droplet className="w-7 h-7 text-red-500" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{donor.fullName}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" /> {donor.address || 'Không rõ vị trí'} ({donor.distanceInKm ? donor.distanceInKm.toFixed(1) : 'N/A'} km)
                        </span>
                            <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" /> Hiến gần nhất: {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                        </span>
                        </div>
                    </div>
                </div>

                {/* Right side: Blood Type & Actions */}
                <div className="text-right">    
                    <div className="text-xl font-bold text-red-600">
                        {donor.bloodType ? `Nhóm máu: ${donor.bloodType}` : 'Chưa xác định'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {donor.bloodType ? 'Sẵn sàng hiến máu' : 'Cần xác định nhóm máu'}
                    </div>
                </div>
            </div>

            {/* Bottom part: Compatibility & Contact */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                    Có thể hiến cho: <span className="font-medium text-red-600">{donor.compatibleWith || (donor.bloodType ? getCompatibleRecipients(donor.bloodType) : 'Chưa xác định')}</span>
                </p>
                <button
                    type="button"
                    onClick={() => onContact(donor)} // Modified onClick handler
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <Mail className="w-4 h-4 mr-2" />
                    Liên hệ
                </button>
            </div>
        </div>
    );
};

export default DonorResultCard;