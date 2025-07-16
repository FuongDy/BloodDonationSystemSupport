/**
 * Format date to Vietnamese locale
 */
export const _formatDate = (date, options = {}) => {
  if (!date) return 'Chưa cập nhật';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Date(date).toLocaleDateString('vi-VN', defaultOptions);
};

/**
 * Format date to Vietnamese locale (alias for _formatDate)
 */
export const formatDate = (date, options = {}) => {
  return _formatDate(date, options);
};

/**
 * Format time only
 */
export const formatTime = (date, options = {}) => {
  if (!date) return 'Chưa cập nhật';

  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Date(date).toLocaleTimeString('vi-VN', defaultOptions);
};

/**
 * Format date and time to Vietnamese locale
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return 'Chưa cập nhật';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    ...options,
  };

  return new Date(date).toLocaleDateString('vi-VN', defaultOptions);
};

/**
 * Format full date and time to Vietnamese locale
 */
export const formatFullDateTime = (date, options = {}) => {
  if (!date) return 'Chưa cập nhật';

  const defaultOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options,
  };

  return new Date(date).toLocaleString('vi-VN', defaultOptions);
};

/**
 * Format relative time (e.g., "2 giờ trước")
 */
export const formatRelativeTime = date => {
  if (!date) return 'Chưa cập nhật';

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

  return _formatDate(date);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = phone => {
  if (!phone) return 'Chưa cập nhật';

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Format as Vietnamese phone number
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  return phone;
};

/**
 * Format blood type display
 */
export const formatBloodType = bloodType => {
  if (!bloodType) return 'Chưa xác định';

  if (typeof bloodType === 'string') {
    return bloodType;
  }

  if (bloodType.bloodGroup && bloodType.componentType) {
    return `${bloodType.bloodGroup} (${bloodType.componentType})`;
  }

  return bloodType.description || 'Chưa xác định';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format file size
 */
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Capitalize first letter
 */
export const capitalize = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format currency (VND)
 */
export const formatCurrency = amount => {
  if (amount === null || amount === undefined) return '0 ₫';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Get status color classes for different status types
 */
export const getStatusColor = (status) => {
  const statusColors = {
    // Blog post status
    PUBLISHED: 'bg-green-100 text-green-800 border-green-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',

    // User status
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-red-100 text-red-800 border-red-200',
    BLOCKED: 'bg-red-100 text-red-800 border-red-200',

    // Donation status
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800 border-yellow-200',

    // Blood request status
    URGENT: 'bg-red-100 text-red-800 border-red-200',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    LOW: 'bg-green-100 text-green-800 border-green-200',

    // Inventory status
    IN_STOCK: 'bg-green-100 text-green-800 border-green-200',
    LOW_STOCK: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    OUT_OF_STOCK: 'bg-red-100 text-red-800 border-red-200',
    EXPIRED: 'bg-red-100 text-red-800 border-red-200',
    EXPIRING_SOON: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get role-specific CSS classes
 */
export const getRoleSpecificClasses = role => {
  const roleClasses = {
    // Backend returns these role names from database
    Admin: 'bg-purple-100 text-purple-800 border-purple-200',
    Staff: 'bg-blue-100 text-blue-800 border-blue-200',
    Member: 'bg-green-100 text-green-800 border-green-200',
    Guest: 'bg-gray-100 text-gray-800 border-gray-200',
    // Legacy support (if any old data exists)
    ROLE_ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
    ROLE_STAFF: 'bg-blue-100 text-blue-800 border-blue-200',
    ROLE_DONOR: 'bg-green-100 text-green-800 border-green-200',
    ROLE_USER: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return roleClasses[role] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get status-specific CSS classes for different entities
 */
export const getStatusSpecificClasses = (status) => {
  // Use the same function as getStatusColor for consistency
  return getStatusColor(status);
};
