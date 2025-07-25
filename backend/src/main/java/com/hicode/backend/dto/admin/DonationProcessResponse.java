package com.hicode.backend.dto.admin;

import com.hicode.backend.dto.HealthCheckResponse;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.model.enums.DonationStatus;
import com.hicode.backend.model.enums.DonationType;
import com.hicode.backend.model.enums.UrgencyLevel;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class DonationProcessResponse {
    private Long id;
    private UserResponse donor;
    private DonationStatus status;
    private UrgencyLevel urgency;
    private String note;
    private Integer collectedVolumeMl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AppointmentResponse appointment;
    private HealthCheckResponse healthCheck;
    private DonationType donationType;
    private String certificateUrl;
}