package com.hicode.backend.dto.admin;

import lombok.Data;

@Data
public class DashboardStatsResponse {
    private long totalUsers;
    private double userGrowthRate;
    private long totalBloodDonations;
    private double donationGrowthRate;
    private long activeBloodRequests;
    private double requestGrowthRate;
    private long totalAppointments;
    private double appointmentGrowthRate;
    private long emergencyRequests;
    private long completedDonations;
    private long scheduledAppointments;
    private long cancelledAppointments;
}