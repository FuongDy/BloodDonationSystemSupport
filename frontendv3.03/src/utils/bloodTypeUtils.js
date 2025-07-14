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
 * @param {string} userIdentifier - User ID, email, or any unique identifier
 * @returns {string} Blood type (e.g., 'O+', 'A-')
 */
export const getConsistentBloodType = (userIdentifier) => {
  if (!userIdentifier) {
    return BLOOD_TYPES[0]; // Default to O+
  }
  
  // Create hash from identifier
  let hash = 0;
  for (let i = 0; i < userIdentifier.length; i++) {
    const char = userIdentifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Select blood type based on realistic distribution
  const randomValue = Math.abs(hash) % 100;
  let cumulative = 0;
  
  for (const item of BLOOD_TYPE_DISTRIBUTION) {
    cumulative += item.percentage;
    if (randomValue < cumulative) {
      return item.type;
    }
  }
  
  return 'O+'; // Fallback
};

/**
 * Get blood type with fallback logic
 * @param {Object} process - Donation process object
 * @param {Object} user - Current user object
 * @returns {string} Blood type
 */
export const getProcessBloodType = (process, user) => {
  // Priority: process.donor.bloodType > process.bloodType > user.bloodType > generated
  if (process?.donor?.bloodType) return process.donor.bloodType;
  if (process?.bloodType) return process.bloodType;
  if (user?.bloodType) return user.bloodType;
  
  // Generate consistent blood type based on user or process ID
  const identifier = user?.id || user?.email || process?.id || 'anonymous';
  return getConsistentBloodType(identifier);
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
