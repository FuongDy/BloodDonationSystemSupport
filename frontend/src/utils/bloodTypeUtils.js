// src/utils/bloodTypeUtils.js

/**
 * Utility functions for blood type handling
 */

export const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const BLOOD_TYPE_DISTRIBUTION = [
  { type: 'O+', percentage: 35, color: '#ef4444' },
  { type: 'A+', percentage: 28, color: '#f97316' },
  { type: 'B+', percentage: 20, color: '#eab308' },
  { type: 'AB+', percentage: 8, color: '#22c55e' },
  { type: 'O-', percentage: 5, color: '#3b82f6' },
  { type: 'A-', percentage: 2, color: '#6366f1' },
  { type: 'B-', percentage: 1.5, color: '#8b5cf6' },
  { type: 'AB-', percentage: 0.5, color: '#ec4899' }
];

/**
 * Get a consistent blood type for a user based on their identifier
 * @param {string} _userIdentifier - User ID, email, or any unique identifier (unused)
 * @returns {string} "Chưa xác định nhóm máu" if no identifier or should not generate fake blood type
 */
export const getConsistentBloodType = (_userIdentifier) => {
  // Always return "not determined" instead of generating fake blood types
  return 'Chưa xác định nhóm máu';
};

/**
 * Helper function to extract user blood type
 * @param {Object} user - User object
 * @returns {string|null} - Blood type or null if not found
 */
const extractUserBloodType = (user) => {
  if (user?.bloodType?.bloodGroup) return user.bloodType.bloodGroup;
  if (user?.bloodType && typeof user.bloodType === 'string') return user.bloodType;
  return null;
};

/**
 * Helper function to check if a blood type is likely fake/generated
 * @param {string} bloodType - Blood type to check
 * @param {Object} process - Process object for additional context
 * @returns {boolean} - True if blood type seems fake/generated
 */
const isLikelyFakeBloodType = (bloodType, process) => {
  // If there's no real medical data associated with the blood type, it's likely fake
  // Real blood types should come with either:
  // 1. A completed donation with collected volume
  // 2. Medical verification status
  // 3. User-entered profile data
  
  if (!bloodType || bloodType === 'Chưa xác định nhóm máu') return false;
  
  // If process has no collected volume and status is not COMPLETED, 
  // the blood type might be generated
  const hasRealDonationData = process?.collectedVolumeMl > 0 || process?.status === 'COMPLETED';
  
  // If it's just a default blood type without real data, consider it fake
  if (!hasRealDonationData && (bloodType === 'O+' || bloodType === 'O-')) {
    return true;
  }
  
  return false;
};

/**
 * Get blood type with fallback logic
 * @param {Object} process - Donation process object
 * @param {Object} user - Current user object
 * @returns {string} Blood type or "Chưa xác định nhóm máu" if unknown
 */
export const getProcessBloodType = (process, user) => {
  // Priority 1: Check donor blood type (from completed donation)
  if (process?.donor?.bloodType && !isLikelyFakeBloodType(process.donor.bloodType, process)) {
    return process.donor.bloodType;
  }
  
  // Priority 2: Check user blood type from profile (user-entered data)
  const userBloodType = extractUserBloodType(user);
  if (userBloodType) return userBloodType;
  
  // Priority 3: Check process blood type only if it seems real
  if (process?.bloodType && !isLikelyFakeBloodType(process.bloodType, process)) {
    return process.bloodType;
  }
  
  // If no reliable blood type is available, return "not determined" message
  return 'Chưa xác định nhóm máu';
};

/**
 * Get color for blood type
 * @param {string} bloodType - Blood type
 * @returns {string} Color hex code
 */
export const getBloodTypeColor = (bloodType) => {
  const found = BLOOD_TYPE_DISTRIBUTION.find(item => item.type === bloodType);
  return found ? found.color : '#ef4444';
};

/**
 * Get compatibility information for blood types
 * @param {string} bloodType - Blood type
 * @returns {Object} Compatibility info
 */
export const getBloodTypeCompatibility = (bloodType) => {
  const compatibility = {
    'O+': { canReceiveFrom: ['O+', 'O-'], canDonateTo: ['O+', 'A+', 'B+', 'AB+'] },
    'O-': { canReceiveFrom: ['O-'], canDonateTo: ['ALL'] },
    'A+': { canReceiveFrom: ['A+', 'A-', 'O+', 'O-'], canDonateTo: ['A+', 'AB+'] },
    'A-': { canReceiveFrom: ['A-', 'O-'], canDonateTo: ['A+', 'A-', 'AB+', 'AB-'] },
    'B+': { canReceiveFrom: ['B+', 'B-', 'O+', 'O-'], canDonateTo: ['B+', 'AB+'] },
    'B-': { canReceiveFrom: ['B-', 'O-'], canDonateTo: ['B+', 'B-', 'AB+', 'AB-'] },
    'AB+': { canReceiveFrom: ['ALL'], canDonateTo: ['AB+'] },
    'AB-': { canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'], canDonateTo: ['AB+', 'AB-'] }
  };
  
  return compatibility[bloodType] || compatibility['O+'];
};
