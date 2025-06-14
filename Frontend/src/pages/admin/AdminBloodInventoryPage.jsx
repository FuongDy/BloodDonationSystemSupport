// src/pages/admin/AdminBloodInventoryPage.jsx
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, BarChart3, MoreHorizontal, Droplet } from 'lucide-react';
// import useApi from '../../hooks/useApi'; // Will use later

const mockBloodTypeSummaryData = [
    { id: '1', bloodType: 'A+', availableUnits: 120, capacity: 200, status: 'Normal' },
    { id: '2', bloodType: 'A-', availableUnits: 35, capacity: 100, status: 'Low' },
    { id: '3', bloodType: 'B+', availableUnits: 78, capacity: 200, status: 'Normal' },
    { id: '4', bloodType: 'B-', availableUnits: 22, capacity: 100, status: 'Critical' },
    { id: '5', bloodType: 'AB+', availableUnits: 28, capacity: 100, status: 'Low' },
    { id: '6', bloodType: 'AB-', availableUnits: 15, capacity: 50, status: 'Low' },
    { id: '7', bloodType: 'O+', availableUnits: 142, capacity: 300, status: 'Normal' },
    { id: '8', bloodType: 'O-', availableUnits: 31, capacity: 150, status: 'Critical' },
];

const getStatusColor = (status, type = 'text') => {
    switch (status) {
        case 'Normal':
            return type === 'bg' ? 'bg-green-100' : 'text-green-700';
        case 'Low':
            return type === 'bg' ? 'bg-yellow-100' : 'text-yellow-700';
        case 'Critical':
            return type === 'bg' ? 'bg-red-100' : 'text-red-700';
        default:
            return type === 'bg' ? 'bg-gray-100' : 'text-gray-700';
    }
};

const getFillRateColor = (fillRate) => {
    if (fillRate >= 70) return 'bg-green-500';
    if (fillRate >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
};

const AdminBloodInventoryPage = () => {
    const [activeTab, setActiveTab] = useState('summary');
    // const { data: summaryData, loading: summaryLoading, error: summaryError } = useApi('/inventory/summary'); // For actual API
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setSummaryData(mockBloodTypeSummaryData.map(item => ({
                ...item,
                fillRate: Math.round((item.availableUnits / item.capacity) * 100)
            })));
            setLoading(false);
        }, 500);
    }, []);

    const renderSummaryTab = () => {
        if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
        // if (summaryError) return <div className="text-center py-10 text-red-500">Lỗi tải dữ liệu tóm tắt.</div>;

        return (
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Tóm tắt loại máu</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại máu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sẵn có</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sức chứa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ đầy</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {summaryData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-700">
                                            {item.bloodType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.availableUnits} đơn vị</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.capacity} đơn vị</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center">
                                            <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                                <div
                                                    className={`h-2.5 rounded-full ${getFillRateColor(item.fillRate)}`}
                                                    style={{ width: `${item.fillRate}%` }}
                                                ></div>
                                            </div>
                                            <span>{item.fillRate}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status, 'bg')} ${getStatusColor(item.status, 'text')}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="hover:text-indigo-600">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderBloodUnitsTab = () => (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách đơn vị máu</h2>
            <p className="text-gray-600">Chức năng đang được phát triển. Sẽ hiển thị danh sách chi tiết các đơn vị máu tại đây.</p>
            {/* Placeholder for table or list of blood units */}
        </div>
    );

    const renderChartsTab = () => (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Biểu đồ tồn kho</h2>
            <p className="text-gray-600">Chức năng đang được phát triển. Sẽ hiển thị các biểu đồ thống kê tồn kho tại đây.</p>
            {/* Placeholder for charts */}
        </div>
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý Kho máu</h1>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                        { name: 'Tóm tắt', id: 'summary', icon: LayoutDashboard },
                        { name: 'Đơn vị máu', id: 'units', icon: List },
                        { name: 'Biểu đồ', id: 'charts', icon: BarChart3 },
                    ].map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                                ${activeTab === tab.id
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'summary' && renderSummaryTab()}
                {activeTab === 'units' && renderBloodUnitsTab()}
                {activeTab === 'charts' && renderChartsTab()}
            </div>
        </div>
    );
};

export default AdminBloodInventoryPage;

