// src/components/admin/DashboardWidget.jsx
import React from 'react';

const DashboardWidget = ({ Icon, title, value, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default DashboardWidget;