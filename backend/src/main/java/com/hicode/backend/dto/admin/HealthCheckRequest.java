package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthCheckRequest {

    @NotNull(message = "Eligibility result is required")
    private Boolean isEligible;

    @NotNull(message = "Systolic blood pressure is required")
    @Positive(message = "Systolic pressure must be positive")
    private Integer bloodPressureSystolic; // Huyết áp tâm thu

    @NotNull(message = "Diastolic blood pressure is required")
    @Positive(message = "Diastolic pressure must be positive")
    private Integer bloodPressureDiastolic; // Huyết áp tâm trương

    @NotNull(message = "Hemoglobin level is required")
    @Positive(message = "Hemoglobin level must be positive")
    private Double hemoglobinLevel; // Nồng độ hemoglobin

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Double weight; // Cân nặng

    @NotNull(message = "Heart rate is required")
    @Positive(message = "Heart rate must be positive")
    private Integer heartRate; // Nhịp tim

    @NotNull(message = "Temperature is required")
    @Positive(message = "Temperature must be positive")
    private Double temperature; // Nhiệt độ

    private String notes; // Ghi chú (tùy chọn)
}