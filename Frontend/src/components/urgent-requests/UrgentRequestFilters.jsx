import React from 'react';
import { Hospital, User, Droplet, MapPin, Clock, ShieldQuestion, Search, ChevronDown } from 'lucide-react';

const UrgentRequestFilters = ({ filters, setFilters, bloodTypes }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="relative col-span-1 md:col-span-1">
                    <label htmlFor="searchTerm" className="text-sm font-semibold text-gray-600 mb-1 block">Tìm kiếm</label>
                    <input
                        type="text"
                        name="searchTerm"
                        id="searchTerm"
                        placeholder="Tìm theo tên bệnh nhân, bệnh viện, địa điểm..."
                        value={filters.searchTerm}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <Search className="absolute left-3 top-9 text-gray-400" size={20} />
                </div>

                {/* Blood Type Select */}
                <div className="relative col-span-1 md:col-span-1">
                     <label htmlFor="bloodType" className="text-sm font-semibold text-gray-600 mb-1 block">Nhóm máu</label>
                    <select
                        name="bloodType"
                        id="bloodType"
                        value={filters.bloodType}
                        onChange={handleInputChange}
                        className="w-full appearance-none bg-white pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">Tất cả nhóm máu</option>
                        {/* Populate with actual blood types later */}
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9 text-gray-400" size={20} />
                </div>

                {/* Urgency Select */}
                <div className="relative col-span-1 md:col-span-1">
                    <label htmlFor="urgency" className="text-sm font-semibold text-gray-600 mb-1 block">Mức độ khẩn cấp</label>
                    <select
                        name="urgency"
                        id="urgency"
                        value={filters.urgency}
                        onChange={handleInputChange}
                        className="w-full appearance-none bg-white pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">Tất cả mức độ</option>
                        <option value="Rất khẩn cấp">Rất khẩn cấp</option>
                        <option value="Khẩn cấp">Khẩn cấp</option>
                        <option value="Cần thiết">Cần thiết</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9 text-gray-400" size={20} />
                </div>
            </div>
        </div>
    );
};

export default UrgentRequestFilters;
