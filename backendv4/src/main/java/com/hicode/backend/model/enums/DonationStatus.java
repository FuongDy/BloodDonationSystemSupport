package com.hicode.backend.model.enums;

public enum DonationStatus {
    PENDING_APPROVAL,       // Chờ duyệt đơn đăng ký
    REJECTED,               // Đơn đăng ký bị từ chối
    APPOINTMENT_PENDING,    // Đã duyệt, chờ lên lịch hẹn
    APPOINTMENT_SCHEDULED,  // Đã lên lịch hẹn khám
    HEALTH_CHECK_PASSED,    // Khám sàng lọc đạt
    HEALTH_CHECK_FAILED,    // Khám sàng lọc không đạt
    BLOOD_COLLECTED,        // Đã lấy máu thành công
    TESTING_PASSED,         // Xét nghiệm máu đạt
    TESTING_FAILED,         // Xét nghiệm máu không đạt
    COMPLETED,              // Hoàn thành (máu đã nhập kho)
    CANCELLED               // Người dùng/Staff hủy bỏ
}