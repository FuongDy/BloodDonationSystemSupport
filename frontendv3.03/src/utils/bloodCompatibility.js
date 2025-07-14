// src/utils/bloodCompatibility.js

// Dữ liệu tương thích nhóm máu cho Red Blood Cells (hiến máu thông thường)
// Dựa trên nguyên tắc y khoa: ABO và Rh compatibility
export const BLOOD_COMPATIBILITY_MAP = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'], // Universal recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Chỉ nhận từ O-
};

/**
 * Lấy danh sách các nhóm máu có thể hiến cho nhóm máu đích
 * @param {string} recipientBloodType - Nhóm máu người nhận (A+, B-, etc.)
 * @returns {string[]} Danh sách nhóm máu có thể hiến
 */
export const getCompatibleDonorBloodTypes = (recipientBloodType) => {
  if (!recipientBloodType || typeof recipientBloodType !== 'string') {
    return [];
  }
  
  const normalizedType = recipientBloodType.trim().toUpperCase();
  return BLOOD_COMPATIBILITY_MAP[normalizedType] || [];
};

/**
 * Kiểm tra xem một nhóm máu có thể hiến cho nhóm máu khác không
 * @param {string} donorType - Nhóm máu người hiến
 * @param {string} recipientType - Nhóm máu người nhận
 * @returns {boolean} True nếu tương thích
 */
export const isBloodTypeCompatible = (donorType, recipientType) => {
  const compatibleDonors = getCompatibleDonorBloodTypes(recipientType);
  return compatibleDonors.includes(donorType);
};

/**
 * Lấy mô tả về tính tương thích
 * @param {string} recipientBloodType - Nhóm máu người nhận
 * @returns {Object} Thông tin về tính tương thích
 */
export const getBloodCompatibilityInfo = (recipientBloodType) => {
  const compatibleDonors = getCompatibleDonorBloodTypes(recipientBloodType);
  
  let description = '';
  let isUniversalRecipient = false;
  let hasUniversalDonor = false;
  
  if (recipientBloodType === 'AB+') {
    description = 'Có thể nhận máu từ tất cả các nhóm máu';
    isUniversalRecipient = true;
  } else if (recipientBloodType === 'O-') {
    description = 'Chỉ có thể nhận máu từ nhóm O-';
  } else {
    description = `Có thể nhận máu từ ${compatibleDonors.length} nhóm máu`;
  }
  
  hasUniversalDonor = compatibleDonors.includes('O-');
  
  return {
    compatibleDonors,
    description,
    isUniversalRecipient,
    hasUniversalDonor,
    donorCount: compatibleDonors.length
  };
};
