
/**
 * Check if user has completed CCCD verification
 * @param {Object} user - User object from AuthContext
 * @returns {boolean} - True if CCCD is verified, false otherwise
 */
export const hasValidCCCD = (user) => {
  if (!user) return false;

  // Ưu tiên hàng đầu là trường 'idCardVerified' từ backend
  if (user.idCardVerified === true) {
    return true;
  }

  // Giữ lại logic cũ để tương thích ngược nếu cần
  return !!(user.cccvFrontImage && user.cccvBackImage) ||
      !!(user.frontImage && user.backImage) ||
      !!(user.idCardFrontImage && user.idCardBackImage);
};

/**
 * Get CCCD verification status message
 * @param {Object} user - User object
 * @returns {Object} - Status object with message and type
 */
export const getCCCDVerificationStatus = (user) => {
  if (!user) {
    return {
      isVerified: false,
      message: "Không thể xác định trạng thái xác minh.",
      type: "error"
    };
  }

  // Sử dụng hasValidCCCD đã được cập nhật
  if (hasValidCCCD(user)) {
    return {
      isVerified: true,
      message: "Tài khoản đã được xác minh bằng CCCD/CMND.",
      type: "success"
    };
  }

  return {
    isVerified: false,
    message: "Chưa tải lên CCCD/CMND. Vui lòng cập nhật để có thể đặt lịch hiến máu.",
    type: "warning"
  };
};

/**
 * Check if user can proceed with donation booking
 * @param {Object} user - User object
 * @returns {Object} - Result object with canProceed and reason
 */
export const canProceedWithDonation = (user) => {
  const cccvStatus = getCCCDVerificationStatus(user);

  if (!cccvStatus.isVerified) {
    return {
      canProceed: false,
      reason: "missing_cccd",
      message: "Bạn cần hoàn tất xác minh CCCD/CMND trước khi có thể đặt lịch hiến máu.",
      requiresAction: true,
      actionText: "Cập nhật CCCD",
      actionUrl: "/profile/edit"
    };
  }

  // Add other checks here if needed (age, health conditions, etc.)

  return {
    canProceed: true,
    reason: null,
    message: "Bạn có thể tiếp tục đặt lịch hiến máu."
  };
};
