// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER_REQUEST_OTP: '/auth/register/request-otp',
        REGISTER_VERIFY: '/auth/register/verify',
    },
    USERS: {
        PROFILE: '/users/me/profile',
        UPDATE_PROFILE: '/users/me/profile',
        SEARCH_DONORS: '/users/search/donors-by-location',
    },
    ADMIN: {
        USERS: '/admin/users',
        USER_BY_ID: id => `/admin/users/${id}`,
    },
    BLOOD_TYPES: '/blood-types',
    BLOOD_COMPATIBILITY: '/blood-compatibility',
    BLOOD_REQUESTS: '/blood-requests',
    DONATIONS: {
        REQUEST: '/donations/request',
        HISTORY: '/donations/my-history',
        ALL_REQUESTS: '/donations/requests',
    },
    APPOINTMENTS: '/appointments',
};

// User Roles
// Note: These values match exactly with backend role names from database
export const USER_ROLES = {
    GUEST: 'Guest',
    MEMBER: 'Member',
    STAFF: 'Staff',
    ADMIN: 'Admin',
};

// Blog Permissions
export const BLOG_PERMISSIONS = {
    canCreateBlog: role => ['Admin', 'Staff'].includes(role),
    canEditBlog: (role, authorId, userId) => {
        if (role === 'Admin') return true;
        if (role === 'Staff' && authorId === userId) return true;
        return false;
    },
    canDeleteBlog: (role, authorId, userId) => {
        if (role === 'Admin') return true;
        if (role === 'Staff' && authorId === userId) return true;
        return false;
    },
    canApproveBlog: role => ['Admin'].includes(role),
};

// User Status
export const USER_STATUSES = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    DEACTIVATED: 'DEACTIVATED',
};

// Alias for backward compatibility
export const USER_STATUS = USER_STATUSES;

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Blood Component Types
export const BLOOD_COMPONENT_TYPES = {
    WHOLE_BLOOD: 'Whole Blood',
    PLASMA: 'Plasma',
    RED_BLOOD_CELLS: 'Red Blood Cells',
    PLATELETS: 'Platelets',
    WHITE_BLOOD_CELLS: 'White Blood Cells',
};

// Donation Status
export const DONATION_STATUS = {
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    REJECTED: 'REJECTED',
    APPOINTMENT_PENDING: 'APPOINTMENT_PENDING',
    APPOINTMENT_SCHEDULED: 'APPOINTMENT_SCHEDULED',
    RESCHEDULE_REQUESTED: 'RESCHEDULE_REQUESTED',
    HEALTH_CHECK_PASSED: 'HEALTH_CHECK_PASSED',
    HEALTH_CHECK_FAILED: 'HEALTH_CHECK_FAILED',
    BLOOD_COLLECTED: 'BLOOD_COLLECTED',
    TESTING_PASSED: 'TESTING_PASSED',
    TESTING_FAILED: 'TESTING_FAILED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};

// Request Status
export const REQUEST_STATUS = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    CANCELLED: 'CANCELLED',
};

// Urgency Levels
export const URGENCY_LEVELS = {
    NORMAL: 'NORMAL',
    URGENT: 'URGENT',
    CRITICAL: 'CRITICAL',
};

// Gender Options
export const GENDER_OPTIONS = [
    { value: 'Male', label: 'Nam' },
    { value: 'Female', label: 'Nữ' },
    { value: 'Other', label: 'Khác' },
];

// Form Validation Rules
export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[0-9]{10,11}$/,
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
};

// Theme Options
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};

// Status Colors
export const STATUS_COLORS = {
    [USER_STATUSES.ACTIVE]: 'success',
    [USER_STATUSES.SUSPENDED]: 'error',
    [USER_STATUSES.DEACTIVATED]: 'warning',
    [DONATION_STATUS.COMPLETED]: 'success',
    [DONATION_STATUS.PENDING_APPROVAL]: 'warning',
    [DONATION_STATUS.APPOINTMENT_PENDING]: 'info',
    [DONATION_STATUS.APPOINTMENT_SCHEDULED]: 'info',
    [DONATION_STATUS.RESCHEDULE_REQUESTED]: 'warning',
    [DONATION_STATUS.HEALTH_CHECK_PASSED]: 'success',
    [DONATION_STATUS.HEALTH_CHECK_FAILED]: 'error',
    [DONATION_STATUS.BLOOD_COLLECTED]: 'success',
    [DONATION_STATUS.TESTING_PASSED]: 'success',
    [DONATION_STATUS.TESTING_FAILED]: 'error',
    [DONATION_STATUS.REJECTED]: 'error',
    [DONATION_STATUS.CANCELLED]: 'error',
    [REQUEST_STATUS.FULFILLED]: 'success',
    [REQUEST_STATUS.PENDING]: 'warning',
    [REQUEST_STATUS.CANCELLED]: 'error',
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORKerror: 'Lỗi kết nối mạng. Vui lòng thử lại.',
    UNAUTHORIZED: 'Bạn không có quyền truy cập.',
    FORBIDDEN: 'Truy cập bị từ chối.',
    NOT_FOUND: 'Không tìm thấy tài nguyên.',
    SERVERerror: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    VALIDATIONerror: 'Dữ liệu không hợp lệ.',
    UNKNOWNerror: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Đăng nhập thành công!',
    REGISTER: 'Đăng ký thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    PROFILE_UPDATED: 'Cập nhật hồ sơ thành công!',
    DATA_SAVED: 'Lưu dữ liệu thành công!',
    DATA_DELETED: 'Xóa dữ liệu thành công!',
};

// Inventory Status
export const INVENTORY_STATUS = {
    AVAILABLE: 'AVAILABLE',
    EXPIRED: 'EXPIRED',
    USED: 'USED',
    RESERVED: 'RESERVED',
};

// Hospital Information
export const HOSPITAL_INFO = {
    NAME: 'Bệnh viện Huyết học - FPT',
    FULL_NAME: 'Bệnh viện Huyết học - FPT',
    ADDRESS: '7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000',
    FULL_ADDRESS: 'Bệnh viện Huyết học - FPT (7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000)',
};