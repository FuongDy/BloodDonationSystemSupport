// src/utils/permissions.js

// Define user roles - đồng bộ với database role_id
export const USER_ROLES = {
  ADMIN: 4,      // role_id = 4 trong database
  STAFF: 3,      // role_id = 3 trong database  
  MEMBER: 2,     // role_id = 2 trong database
  USER: 2,       // Alias for MEMBER
  DONOR: 2       // Cũng là member
};

// Define role names for display
export const ROLE_NAMES = {
  4: 'Admin',
  3: 'Staff', 
  2: 'Member'
};

// Define permissions for each feature
export const PERMISSIONS = {
  // Blood Request Management
  BLOOD_REQUEST_CREATE: 'blood_request_create',
  BLOOD_REQUEST_UPDATE: 'blood_request_update',
  BLOOD_REQUEST_DELETE: 'blood_request_delete',
  BLOOD_REQUEST_VIEW_ALL: 'blood_request_view_all',
  BLOOD_REQUEST_MANAGE_STATUS: 'blood_request_manage_status',
  
  // Donation Management
  DONATION_VIEW_ALL: 'donation_view_all',
  DONATION_MANAGE: 'donation_manage',
  DONATION_APPROVE: 'donation_approve',
  DONATION_UPDATE_STATUS: 'donation_update_status',
  
  // User Management
  USER_VIEW_ALL: 'user_view_all',
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_MANAGE_ROLES: 'user_manage_roles',
  
  // Blood Type & Compatibility
  BLOOD_TYPE_MANAGE: 'blood_type_manage',
  BLOOD_COMPATIBILITY_MANAGE: 'blood_compatibility_manage',
  
  // Inventory Management
  INVENTORY_VIEW: 'inventory_view',
  INVENTORY_UPDATE: 'inventory_update',
  
  // Reports & Analytics
  REPORTS_VIEW: 'reports_view',
  ANALYTICS_VIEW: 'analytics_view',
  
  // Emergency Management
  EMERGENCY_MANAGE: 'emergency_manage',
  
  // System Configuration
  SYSTEM_CONFIG: 'system_config'
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS)
  ],
  
  [USER_ROLES.STAFF]: [
    // Blood Request Management (limited)
    PERMISSIONS.BLOOD_REQUEST_CREATE,
    PERMISSIONS.BLOOD_REQUEST_UPDATE,
    PERMISSIONS.BLOOD_REQUEST_VIEW_ALL,
    PERMISSIONS.BLOOD_REQUEST_MANAGE_STATUS,
    
    // Donation Management
    PERMISSIONS.DONATION_VIEW_ALL,
    PERMISSIONS.DONATION_MANAGE,
    PERMISSIONS.DONATION_APPROVE,
    PERMISSIONS.DONATION_UPDATE_STATUS,
    
    // Limited User Management
    PERMISSIONS.USER_VIEW_ALL,
    PERMISSIONS.USER_UPDATE, // Can update user info but not create/delete
    
    // Blood Type Management
    PERMISSIONS.BLOOD_TYPE_MANAGE,
    PERMISSIONS.BLOOD_COMPATIBILITY_MANAGE,
    
    // Inventory Management
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_UPDATE,
    
    // Emergency Management
    PERMISSIONS.EMERGENCY_MANAGE,
    
    // Basic Reports
    PERMISSIONS.REPORTS_VIEW
  ],
  
  [USER_ROLES.USER]: [
    // Users can only pledge for blood requests
  ],
  
  [USER_ROLES.DONOR]: [
    // Same as USER but with donation history access
  ]
};

// Helper functions - cập nhật để làm việc với role_id từ database
export const hasPermission = (userRoleId, permission) => {
  if (!userRoleId || !permission) return false;
  const rolePermissions = ROLE_PERMISSIONS[userRoleId] || [];
  return rolePermissions.includes(permission);
};

export const hasAnyPermission = (userRoleId, permissions) => {
  if (!userRoleId || !permissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(userRoleId, permission));
};

export const hasAllPermissions = (userRoleId, permissions) => {
  if (!userRoleId || !permissions || !Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(userRoleId, permission));
};

export const isAdmin = (userRoleId) => {
  return userRoleId === USER_ROLES.ADMIN; // 4
};

export const isStaff = (userRoleId) => {
  return userRoleId === USER_ROLES.STAFF; // 3
};

export const isStaffOrAdmin = (userRoleId) => {
  return userRoleId === USER_ROLES.STAFF || userRoleId === USER_ROLES.ADMIN; // 3 hoặc 4
};

export const isDonor = (userRoleId) => {
  return userRoleId === USER_ROLES.DONOR; // 2
};

export const isUser = (userRoleId) => {
  return userRoleId === USER_ROLES.USER; // 2
};

// Get role name for display
export const getRoleName = (userRoleId) => {
  return ROLE_NAMES[userRoleId] || 'Member';
};

// Feature-specific permission checks - cập nhật để dùng role_id
export const canManageBloodRequests = (userRoleId) => {
  return hasAnyPermission(userRoleId, [
    PERMISSIONS.BLOOD_REQUEST_CREATE,
    PERMISSIONS.BLOOD_REQUEST_UPDATE,
    PERMISSIONS.BLOOD_REQUEST_DELETE,
    PERMISSIONS.BLOOD_REQUEST_MANAGE_STATUS
  ]);
};

export const canManageDonations = (userRoleId) => {
  return hasAnyPermission(userRoleId, [
    PERMISSIONS.DONATION_MANAGE,
    PERMISSIONS.DONATION_APPROVE,
    PERMISSIONS.DONATION_UPDATE_STATUS
  ]);
};

export const canViewReports = (userRoleId) => {
  return hasAnyPermission(userRoleId, [
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW
  ]);
};

export const canManageUsers = (userRoleId) => {
  return hasAnyPermission(userRoleId, [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_MANAGE_ROLES
  ]);
};
