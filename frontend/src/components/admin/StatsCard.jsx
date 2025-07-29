// src/components/admin/StatsCard.jsx

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  growthRate, 
  gradientFrom, 
  gradientTo,
  iconColor = "text-white"
}) => {
  const formatGrowthRate = (rate) => {
    if (!rate && rate !== 0) return '+0%';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  const getGrowthColor = (rate) => {
    if (!rate && rate !== 0) return 'text-gray-300';
    return rate >= 0 ? 'text-green-300' : 'text-red-300';
  };

  return (
    <div className="relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl border border-white/30`}></div>
      <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
      <div className="relative p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white drop-shadow-md mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-white/80 mb-2">{title}</div>
        <div className="text-xs text-white/70">{subtitle}</div>
        {growthRate !== undefined && (
          <div className={`mt-2 text-xs font-medium ${getGrowthColor(growthRate)}`}>
            {formatGrowthRate(growthRate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
