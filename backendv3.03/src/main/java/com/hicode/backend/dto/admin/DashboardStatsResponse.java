package com.hicode.backend.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardStatsResponse {
    private Long activeBloodRequests;
    private Long todayDonations;
    private Long newRegistrations;
    private Long totalBloodUnits;
    private Long donationGrowthRate;
    private Long totalUsers;
    private Long pendingAppointments;
    private Long completedDonationsThisMonth;
}
