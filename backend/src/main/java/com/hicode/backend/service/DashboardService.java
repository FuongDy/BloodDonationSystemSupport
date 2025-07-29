package com.hicode.backend.service;

import com.hicode.backend.dto.admin.DashboardStatsResponse;
import com.hicode.backend.dto.admin.WeeklyActivityResponse;
import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.DonationStatus;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.model.enums.UrgencyLevel;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DonationProcessRepository donationProcessRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationAppointmentRepository donationAppointmentRepository;

    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonth = now.minus(1, ChronoUnit.MONTHS);

        // Total users and growth rate
        long totalUsers = userRepository.count();
        long previousTotalUsers = userRepository.countByCreatedAtBefore(lastMonth);
        stats.setTotalUsers(totalUsers);
        stats.setUserGrowthRate(calculateGrowthRate(previousTotalUsers, totalUsers));

        // Blood donations statistics
        long totalBloodDonations = donationProcessRepository.countByStatus(DonationStatus.COMPLETED);
        long previousBloodDonations = donationProcessRepository.countByStatusAndCreatedAtBefore(DonationStatus.COMPLETED, lastMonth);
        stats.setTotalBloodDonations(totalBloodDonations);
        stats.setDonationGrowthRate(calculateGrowthRate(previousBloodDonations, totalBloodDonations));

        // Blood requests statistics
        long activeBloodRequests = bloodRequestRepository.countByStatus(RequestStatus.PENDING);
        long previousBloodRequests = bloodRequestRepository.countByCreatedAtBefore(lastMonth);
        stats.setActiveBloodRequests(activeBloodRequests);
        stats.setRequestGrowthRate(calculateGrowthRate(previousBloodRequests, activeBloodRequests));

        // Appointments statistics
        long totalAppointments = donationAppointmentRepository.count();
        long previousAppointments = donationAppointmentRepository.countByAppointmentDateBefore(lastMonth.toLocalDate());
        stats.setTotalAppointments(totalAppointments);
        stats.setAppointmentGrowthRate(calculateGrowthRate(previousAppointments, totalAppointments));

        // Additional statistics
        stats.setEmergencyRequests(bloodRequestRepository.countByUrgency(UrgencyLevel.CRITICAL));
        stats.setCompletedDonations(donationProcessRepository.countByStatus(DonationStatus.COMPLETED));
        // Remove scheduled and cancelled appointments as entity doesn't have status field
        stats.setScheduledAppointments(0L);
        stats.setCancelledAppointments(0L);

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

    public List<com.hicode.backend.dto.admin.ActiveDonorResponse> getActiveDonors(int limit) {
        // Get all users who have completed donations
        List<com.hicode.backend.model.entity.User> users = userRepository.findUsersByDonationStatus(DonationStatus.COMPLETED, PageRequest.of(0, limit * 3)); // Get more users to sort properly
        
        return users.stream().map(user -> {
            com.hicode.backend.dto.admin.ActiveDonorResponse donor = new com.hicode.backend.dto.admin.ActiveDonorResponse();
            donor.setId(user.getId());
            donor.setName(user.getFullName());
            donor.setBloodType(user.getBloodType() != null ? user.getBloodType().getBloodGroup() : "N/A");
            
            // Count donations for this user
            long donationCount = donationProcessRepository.countByDonorIdAndStatus(user.getId(), DonationStatus.COMPLETED);
            donor.setTotalDonations(donationCount);
            
            // Get last donation date
            List<com.hicode.backend.model.entity.DonationProcess> lastDonations = 
                donationProcessRepository.findTopByDonorIdAndStatusOrderByCreatedAtDesc(
                    user.getId(), DonationStatus.COMPLETED, PageRequest.of(0, 1));
            
            if (!lastDonations.isEmpty()) {
                donor.setLastDonation(lastDonations.get(0).getCreatedAt());
            }
            
            donor.setStatus("Active");
            return donor;
        })
        .sorted((d1, d2) -> {
            // Sort by donation count (descending), then by last donation date (descending)
            int countComparison = Long.compare(d2.getTotalDonations(), d1.getTotalDonations());
            if (countComparison != 0) {
                return countComparison;
            }
            // If donation counts are equal, sort by last donation date (most recent first)
            if (d1.getLastDonation() != null && d2.getLastDonation() != null) {
                return d2.getLastDonation().compareTo(d1.getLastDonation());
            }
            return 0;
        })
        .limit(limit)
        .collect(Collectors.toList());
    }

    private double calculateGrowthRate(long previousValue, long currentValue) {
        if (previousValue == 0) {
            return currentValue > 0 ? 100.0 : 0.0;
        }
        return ((double) (currentValue - previousValue) / previousValue) * 100;
    }
}