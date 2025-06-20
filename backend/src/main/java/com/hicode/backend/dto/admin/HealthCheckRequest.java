package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthCheckRequest {
    @NotNull(message = "Eligibility result is required")
    private Boolean isEligible;

    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Double hemoglobinLevel;
    private String notes;
}