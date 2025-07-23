package com.hicode.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDashboardStatsResponse {
    private long totalDonations;
    private long totalVolume;
    private LocalDateTime lastDonation;
    private LocalDate nextEligibleDate;
    private String bloodType;
    private int donationStreak;
    private long lifeSaved;
    private List<Achievement> achievements;

    @Data
    public static class Achievement {
        private Long id;
        private String name;
        private String description;
        private LocalDateTime earnedDate;
        private String icon;
    }
}