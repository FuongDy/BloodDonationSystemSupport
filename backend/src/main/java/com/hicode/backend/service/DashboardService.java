package com.hicode.backend.service;

import com.hicode.backend.dto.admin.DashboardStatsResponse;
import com.hicode.backend.dto.admin.WeeklyActivityResponse;
import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.DonationStatus;
import com.hicode.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DonationProcessRepository donationProcessRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationAppointmentRepository donationAppointmentRepository;

    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        long totalUsers = userRepository.count();
        stats.setTotalUsers(totalUsers);

        LocalDateTime lastMonth = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
        long previousTotalUsers = userRepository.countByCreatedAtBefore(lastMonth);
        stats.setUserGrowthRate(calculateGrowthRate(previousTotalUsers, totalUsers));

        // Add more statistics calculation here based on the repositories

        return stats;
    }

    public WeeklyActivityResponse getWeeklyActivityData() {
        WeeklyActivityResponse response = new WeeklyActivityResponse();
        List<WeeklyActivityResponse.WeeklyDataItem> weeklyData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);

        // Lấy dữ liệu trong tuần
        List<DonationProcess> donations = donationProcessRepository.findAllByCreatedAtBetween(startOfWeek, endOfWeek);
        List<BloodRequest> requests = bloodRequestRepository.findAllByCreatedAtBetween(startOfWeek, endOfWeek);
        List<com.hicode.backend.model.entity.DonationAppointment> appointments = donationAppointmentRepository.findAllByAppointmentDateBetween(startOfWeek.toLocalDate(), endOfWeek.toLocalDate());

        // Nhóm theo ngày
        Map<DayOfWeek, Long> dailyDonations = donations.stream()
                .filter(d -> d.getStatus() == DonationStatus.COMPLETED)
                .collect(Collectors.groupingBy(d -> d.getCreatedAt().getDayOfWeek(), Collectors.counting()));

        Map<DayOfWeek, Long> dailyRequests = requests.stream()
                .collect(Collectors.groupingBy(r -> r.getCreatedAt().getDayOfWeek(), Collectors.counting()));

        Map<DayOfWeek, Long> dailyAppointments = appointments.stream()
                .collect(Collectors.groupingBy(a -> a.getAppointmentDate().getDayOfWeek(), Collectors.counting()));


        String[] dayNames = {"T2", "T3", "T4", "T5", "T6", "T7", "CN"};
        DayOfWeek[] dayOfWeeks = {DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY};

        for (int i = 0; i < 7; i++) {
            WeeklyActivityResponse.WeeklyDataItem item = new WeeklyActivityResponse.WeeklyDataItem();
            item.setName(dayNames[i]);
            item.setDonations(dailyDonations.getOrDefault(dayOfWeeks[i], 0L));
            item.setAppointments(dailyAppointments.getOrDefault(dayOfWeeks[i], 0L));
            item.setRequests(dailyRequests.getOrDefault(dayOfWeeks[i], 0L));
            weeklyData.add(item);
        }

        response.setWeeklyData(weeklyData);
        return response;
    }

    private double calculateGrowthRate(long previousValue, long currentValue) {
        if (previousValue == 0) {
            return currentValue > 0 ? 100.0 : 0.0;
        }
        return ((double) (currentValue - previousValue) / previousValue) * 100;
    }
}