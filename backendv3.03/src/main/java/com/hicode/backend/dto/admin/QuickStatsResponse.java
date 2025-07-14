package com.hicode.backend.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuickStatsResponse {
    private Long pendingAppointments;
    private Long completedDonations;
    private Long availableBloodUnits;
    private Long activeRequests;
    private Long totalDonors;
    private Long emergencyRequests;
}
