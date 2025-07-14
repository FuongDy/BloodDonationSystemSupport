// src/components/admin/LiveActivityFeed.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplet, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Clock,
  TrendingUp
} from 'lucide-react';

const LiveActivityFeed = ({ maxItems = 5, className = "" }) => {
  const [activities, setActivities] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  // Mock real-time activities
  const mockActivities = [
    {
      id: 1,
      type: 'donation',
      message: 'Nguyễn Văn A vừa hoàn thành hiến máu',
      time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      icon: <Droplet className="w-4 h-4 text-red-500" />,
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 2,
      type: 'appointment',
      message: 'Trần Thị B đã đặt lịch hẹn mới',
      time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      icon: <Calendar className="w-4 h-4 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 3,
      type: 'emergency',
      message: 'Yêu cầu máu khẩn cấp tại BV Chợ Rẫy',
      time: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 4,
      type: 'registration',
      message: 'Lê Văn C đã đăng ký tài khoản mới',
      time: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      icon: <UserPlus className="w-4 h-4 text-green-500" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 5,
      type: 'completion',
      message: 'Hoàn thành xét nghiệm cho 15 mẫu máu',
      time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 6,
      type: 'stats',
      message: 'Đạt mục tiêu hiến máu tuần này (+120%)',
      time: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      icon: <TrendingUp className="w-4 h-4 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    setActivities(mockActivities.slice(0, maxItems));
    
    const interval = setInterval(() => {
      // Add a new random activity every 30 seconds
      const newActivity = {
        ...mockActivities[Math.floor(Math.random() * mockActivities.length)],
        id: Date.now(),
        time: new Date(),
        message: mockActivities[Math.floor(Math.random() * mockActivities.length)].message.replace(/\b\w+\s\w+\s\w/, 'Người dùng X')
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
    }, 30000);

    return () => clearInterval(interval);
  }, [maxItems]);

  const formatTimeAgo = (time) => {
    const now = new Date();
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return time.toLocaleDateString('vi-VN');
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 p-4 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-white" />
          <h3 className="text-sm font-medium text-white">Hoạt động gần đây</h3>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-white/80">Live</span>
        </div>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className={`flex items-start space-x-3 p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 ${
              index === 0 ? 'animate-fade-in' : ''
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/95 leading-tight">
                {activity.message}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-white/60" />
                <span className="text-xs text-white/70">
                  {formatTimeAgo(activity.time)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LiveActivityFeed;
