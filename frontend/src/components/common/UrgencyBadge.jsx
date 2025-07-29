// src/components/common/UrgencyBadge.jsx
import { Badge } from '../ui/Badge';

const UrgencyBadge = ({ urgency, className, ...props }) => {
  const getUrgencyConfig = urgency => {
    switch (urgency) {
      case 'CRITICAL':
        return { variant: 'error', label: 'Cực kỳ khẩn cấp' };
      case 'URGENT':
        return { variant: 'warning', label: 'Khẩn cấp' };
      case 'NORMAL':
        return { variant: 'info', label: 'Bình thường' };
      default:
        return { variant: 'default', label: urgency };
    }
  };

  const config = getUrgencyConfig(urgency);

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.label}
    </Badge>
  );
};

export default UrgencyBadge;
