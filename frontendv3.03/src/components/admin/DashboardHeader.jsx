// src/components/admin/DashboardHeader.jsx
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Users,
  Droplet,
  Sun,
  Moon,
  CloudSun,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import LiveActivityFeed from './LiveActivityFeed';

const DashboardHeader = ({ 
  title, 
  description, 
  stats = [],
  showTime = true,
  showWeather = true,
  showActivityFeed = true,
  variant = 'default' // 'default', 'reports', 'compact'
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  // Update time every second
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // Get gradient based on variant
  const getGradient = () => {
    switch (variant) {
      case 'reports':
        return 'from-indigo-600/60 via-purple-500/50 to-blue-500/60';
      case 'users':
        return 'from-blue-600/60 via-cyan-500/50 to-teal-500/60';
      case 'blood-types':
        return 'from-red-600/60 via-pink-500/50 to-rose-500/60';
      case 'compatibility':
        return 'from-green-600/60 via-emerald-500/50 to-teal-500/60';
      case 'emergency':
        return 'from-red-600/60 via-orange-500/50 to-yellow-500/60';
      case 'donation-process':
        return 'from-purple-600/60 via-indigo-500/50 to-blue-500/60';
      case 'donation-history':
        return 'from-amber-600/60 via-orange-500/50 to-red-500/60';
      case 'inventory':
        return 'from-emerald-600/60 via-green-500/50 to-teal-500/60';
      case 'find-donor':
        return 'from-pink-600/60 via-purple-500/50 to-indigo-500/60';
      case 'compact':
        return 'from-purple-500/50 via-pink-400/40 to-purple-600/50';
      default:
        return 'from-purple-600/60 via-purple-500/50 to-pink-500/60';
    }
  };

  if (!mounted) {
    return (
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 via-purple-500/50 to-pink-500/60 backdrop-blur-md rounded-2xl border border-white/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
        <div className="relative p-6 md:p-8 h-32 flex items-center justify-center">
          <div className="text-white text-lg font-medium">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Background with gradient and glass effect - Enhanced visibility */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} backdrop-blur-md rounded-2xl border border-white/30`}></div>
      
      {/* Stronger background overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-300/40 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-300/50 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-purple-400/30 rounded-full animate-pulse delay-500"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 opacity-30">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-white animate-pulse" />
          <Star className="w-3 h-3 text-white animate-pulse delay-500" />
          <Star className="w-5 h-5 text-white animate-pulse delay-1000" />
        </div>
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Left section - Title and description */}
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                {title}
              </h1>
              <p className="text-lg text-white/90 leading-relaxed max-w-2xl drop-shadow-sm">
                {description}
              </p>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
