// src/components/staff/WeeklyActivitiesChart.jsx
import React from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const WeeklyActivitiesChart = ({ weeklyActivities, loading }) => {
  if (loading || !weeklyActivities) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Hoạt động trong tuần</h3>
              <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const { donations, appointments, weekRange } = weeklyActivities;
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Tính max value để scale biểu đồ
  const maxValue = Math.max(
    ...days.map(day => Math.max((donations[day] || 0), (appointments[day] || 0)))
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động trong tuần</h3>
            <p className="text-sm text-gray-500">Số lượng hiến máu và lịch hẹn theo ngày</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{weekRange}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm text-gray-600">Hiến máu</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Lịch hẹn</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <div className="flex items-end justify-between h-full space-x-4">
          {days.map(day => {
            const donationCount = donations[day] || 0;
            const appointmentCount = appointments[day] || 0;
            
            const donationHeight = (donationCount / maxValue) * 100;
            const appointmentHeight = (appointmentCount / maxValue) * 100;

            return (
              <div key={day} className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center space-x-1 mb-2">
                  {/* Donation bar */}
                  <div className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-md transition-all duration-300 hover:from-purple-600 hover:to-purple-500 min-h-[4px] relative group"
                      style={{ height: `${donationHeight}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {donationCount} hiến máu
                      </div>
                    </div>
                  </div>
                  
                  {/* Appointment bar */}
                  <div className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500 min-h-[4px] relative group"
                      style={{ height: `${appointmentHeight}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {appointmentCount} lịch hẹn
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Day label */}
                <div className="text-sm font-medium text-gray-700">{day}</div>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-6">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Tổng hiến máu</p>
              <p className="text-2xl font-bold text-purple-900">
                {Object.values(donations).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold text-blue-900">
                {Object.values(appointments).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivitiesChart;
