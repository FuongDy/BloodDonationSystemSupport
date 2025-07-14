// src/components/staff/WeeklyActivitiesChart.jsx
import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, RefreshCw, Activity, AlertCircle } from 'lucide-react';

const WeeklyActivitiesChart = ({ 
  weeklyActivities, 
  loading, 
  onRefresh, 
  lastUpdated,
  realTimeStats 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 1000); // Prevent rapid clicking
      }
    }
  };

  const formatLastUpdated = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Vừa cập nhật';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (loading || !weeklyActivities || !weeklyActivities.weeklyData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Hoạt động trong tuần</h3>
              <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-orange-500 animate-pulse"></div>
            </div>
            <p className="text-gray-500">Đang tải biểu đồ...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = weeklyActivities.weeklyData || [];
  const summary = weeklyActivities.summary || {};
  
  // Tính maxScale động dựa trên dữ liệu thực tế, tối thiểu là 5 để cột không quá cao
  const dataMaxValue = Math.max(...chartData.map(item => Math.max(item.donations || 0, item.requests || 0)), 0);
  const maxScale = dataMaxValue > 0 ? Math.max(dataMaxValue, 5) : 5;

  const totalDonations = summary.totalDonations || chartData.reduce((sum, item) => sum + (item.donations || 0), 0);
  const totalRequests = summary.totalRequests || chartData.reduce((sum, item) => sum + (item.requests || 0), 0);

  const weekOverWeekGrowth = summary.weekOverWeekGrowth || {};
  const donationGrowth = weekOverWeekGrowth.donations || 12;
  const requestGrowth = weekOverWeekGrowth.requests || -5;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Hoạt động trong tuần</h3>
            <p className="text-sm text-gray-600">Số lượng hiến máu và yêu cầu theo ngày</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Tuần này</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className={`w-4 h-4 ${donationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className={donationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
              {donationGrowth >= 0 ? '+' : ''}{donationGrowth}% so với tuần trước
            </span>
          </div>
          {realTimeStats && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <Activity className="w-4 h-4" />
              <span>Live</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Tổng hiến máu</p>
              <p className="text-2xl font-bold text-orange-600">{totalDonations}</p>
              {weekOverWeekGrowth.donations && (
                <p className={`text-xs ${donationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {donationGrowth >= 0 ? '↗' : '↘'} {Math.abs(donationGrowth)}% tuần trước
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">{summary.averageCompletionRate || 89}%</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Tổng yêu cầu</p>
              <p className="text-2xl font-bold text-blue-600">{totalRequests}</p>
              {weekOverWeekGrowth.requests && (
                <p className={`text-xs ${requestGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {requestGrowth >= 0 ? '↗' : '↘'} {Math.abs(requestGrowth)}% tuần trước
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">{summary.totalEmergencyRequests || 8}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time alerts */}
      {realTimeStats && realTimeStats.alerts && realTimeStats.alerts.length > 0 && (
        <div className="mb-4">
          {realTimeStats.alerts.slice(0, 2).map((alert, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-2 p-2 rounded-lg text-sm mb-2 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Last updated info */}
      {lastUpdated && (
        <div className="text-xs text-gray-500 mb-4">
          Cập nhật lần cuối: {formatLastUpdated(lastUpdated)}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-400 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Hiến máu</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Yêu cầu máu</span>
        </div>
      </div>

      {/* Chart and X-Axis Wrapper */}
      <div>
        {/* Nếu tất cả giá trị đều bằng 0, hiển thị thông báo */}
        {dataMaxValue === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-gray-400 text-lg font-semibold">
            Không có dữ liệu tuần này
          </div>
        ) : (
          <>
            {/* Chart Area */}
            <div className="relative h-[220px] pl-12 pr-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 w-10">
                {[maxScale, Math.floor(maxScale * 0.9), Math.floor(maxScale * 0.7), Math.floor(maxScale * 0.5), Math.floor(maxScale * 0.3), Math.floor(maxScale * 0.1), 0].map((val, i) => (
                  <div
                    key={'yaxis-' + val + '-' + i}
                    className="flex items-center justify-end pr-2 h-0"
                    style={{ 
                      transform: i === 0 ? 'translateY(-6px)' : i === 6 ? 'translateY(6px)' : 'translateY(0)'
                    }}
                  >
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Grid lines */}
              <div className="absolute left-12 top-0 right-0 h-full pointer-events-none">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={'grid-' + index}
                    className="absolute w-full border-t border-gray-200"
                    style={{ top: `${(index / 6) * 100}%` }}
                  />
                ))}
              </div>

              {/* Bar data */}
              <div className="absolute left-12 top-0 right-0 h-full flex items-end justify-between space-x-2">
                {chartData.map((dayData, index) => {
                  const donationCount = dayData.donations || 0;
                  const requestCount = dayData.requests || 0;

                  const donationHeight = (donationCount / maxScale) * 220;
                  const requestHeight = (requestCount / maxScale) * 220;

                  return (
                    <div key={'bar-' + dayData.day + '-' + index} className="flex-1 w-full flex justify-center space-x-1">
                      {/* Donation bar */}
                      <div className="flex-1 flex flex-col items-center justify-end">
                        <div
                          className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-500 relative group shadow-lg"
                          style={{ height: `${Math.max(donationHeight, 2)}px` }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                            <div className="text-center">
                              <div className="font-semibold">{donationCount}</div>
                              <div className="text-gray-300">hiến máu</div>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </div>

                      {/* Request bar */}
                      <div className="flex-1 flex flex-col items-center justify-end">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 relative group shadow-lg"
                          style={{ height: `${Math.max(requestHeight, 2)}px` }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                            <div className="text-center">
                              <div className="font-semibold">{requestCount}</div>
                              <div className="text-gray-300">yêu cầu</div>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* X-Axis Labels (Day Labels) */}
            <div className="flex justify-between pl-12 pr-4 mt-3">
              {chartData.map((dayData, index) => (
                <div key={'label-' + dayData.day + '-' + index} className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-700 px-2 py-1 bg-gray-50 rounded-lg">
                    {dayData.day}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyActivitiesChart;