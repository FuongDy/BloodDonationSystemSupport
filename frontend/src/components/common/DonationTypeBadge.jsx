// src/components/common/DonationTypeBadge.jsx
import { getDonationTypeConfig } from '../../utils/donationTypeUtils';

const DonationTypeBadge = ({ donationType, size = 'normal', showIcon = true }) => {
  const config = getDonationTypeConfig(donationType);
  const IconComponent = config.icon;
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    normal: 'px-2.5 py-1.5 text-xs',
    large: 'px-3 py-2 text-sm'
  };
  
  const iconSizes = {
    small: 'w-3 h-3',
    normal: 'w-3.5 h-3.5',
    large: 'w-4 h-4'
  };

  return (
    <span
      className={`
        inline-flex items-center
        ${sizeClasses[size]}
        font-medium
        rounded-full
        ${config.badgeColor}
        transition-colors
      `}
      title={config.description}
    >
      {showIcon && IconComponent && (
        <IconComponent className={`${iconSizes[size]} mr-1.5`} />
      )}
      {config.label}
    </span>
  );
};

export default DonationTypeBadge;
