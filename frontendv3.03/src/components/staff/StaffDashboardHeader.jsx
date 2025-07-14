// src/components/staff/StaffDashboardHeader.jsx
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Activity, 
  Sun,
  Moon,
  CloudSun,
  Star,
  Shield,
  Heart,
} from 'lucide-react';
import RoleBadge from '../common/RoleBadge';

const StaffDashboardHeader = ({ 
  title = "Staff Dashboard", 
  description = "Theo dõi và quản lý các hoạt động hiến máu",
  showTime = true,
  showWeather = true,
  variant = 'default'
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  // Update time every second
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get greeting based on time of day
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 6) {
      setGreeting('Chúc bạn đêm tốt lành');
    } else if (hour < 12) {
      setGreeting('Chào buổi sáng');
    } else if (hour < 18) {
      setGreeting('Chào buổi chiều');
    } else {
      setGreeting('Chào buổi tối');
    }
  }, [currentTime]);

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get weather icon based on time
  const getWeatherIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) {
      return <Sun className="w-6 h-6 text-yellow-400 animate-pulse" />;
    } else if (hour >= 12 && hour < 18) {
      return <CloudSun className="w-6 h-6 text-orange-400" />;
    } else {
      return <Moon className="w-6 h-6 text-blue-300" />;
    }
  };

  // Get gradient for staff - orange theme
  const getGradient = () => {
    switch (variant) {
      case 'donations':
        return 'from-red-600/60 via-red-500/50 to-pink-500/60';
      case 'appointments':
        return 'from-blue-600/60 via-blue-500/50 to-indigo-500/60';
      case 'inventory':
        return 'from-emerald-600/60 via-green-500/50 to-teal-500/60';
      case 'emergency':
        return 'from-red-600/60 via-orange-500/50 to-yellow-500/60';
      case 'reports':
        return 'from-purple-600/60 via-purple-500/50 to-indigo-500/60';
      case 'blog':
        return 'from-indigo-600/60 via-purple-500/50 to-blue-500/60';
      case 'compact':
        return 'from-orange-500/50 via-amber-400/40 to-orange-600/50';
      default:
        return 'from-orange-600/60 via-orange-500/50 to-amber-500/60';
    }
  };

  if (!mounted) {
    return (
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-orange-500/50 to-amber-500/60 backdrop-blur-md rounded-2xl border border-white/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
        <div className="relative p-6 md:p-8 h-32 flex items-center justify-center">
          <div className="text-white text-lg font-medium">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Background with gradient and glass effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} backdrop-blur-md rounded-2xl border border-white/30`}></div>
      
      {/* Background overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
      
      {/* Animated background particles - orange themed */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-300/40 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-300/50 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-orange-400/30 rounded-full animate-pulse delay-500"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 opacity-30">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-white animate-pulse" />
          <Heart className="w-3 h-3 text-white animate-pulse delay-500" />
          <Star className="w-5 h-5 text-white animate-pulse delay-1000" />
        </div>
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Left section - Title and description */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                  {title}
                </h1>
                <p className="text-lg text-white/90 leading-relaxed max-w-2xl drop-shadow-sm">
                  {description}
                </p>
              </div>
            </div>

            {/* Staff badge and greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 pt-4">
              <div className="flex items-center space-x-3 text-white/95">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <RoleBadge role="Staff" size="sm" />
                </div>
                <Activity className="w-5 h-5 text-white" />
                <span className="font-medium">{greeting}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-white/95">
                <Calendar className="w-5 h-5 text-white" />
                <span className="text-sm">{formatDate(currentTime)}</span>
              </div>
            </div>
          </div>

          {/* Right section - Time */}
          <div className="flex flex-col items-start lg:items-end">
            {showTime && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/25 transition-all duration-300 shadow-lg min-w-[200px]">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-white" />
                    {showWeather && getWeatherIcon()}
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl md:text-3xl font-bold text-white tabular-nums drop-shadow-md">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-sm text-white/80">
                      Việt Nam (UTC+7)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardHeader;
