package com.hicode.backend.controller.staff;

import com.hicode.backend.service.DonationService;
import com.hicode.backend.service.BloodRequestService;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.entity.BloodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
public class StaffDashboardController {
    @Autowired
    private DonationService donationService;
    @Autowired
    private BloodRequestService bloodRequestService;

    @GetMapping("/weekly-activities")
    public ResponseEntity<?> getWeeklyActivities(@RequestParam(defaultValue = "0") int weekOffset) {
        LocalDate today = LocalDate.now().plusWeeks(weekOffset);
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        Map<String, Integer> donationsByDay = new LinkedHashMap<>();
        Map<String, Integer> requestsByDay = new LinkedHashMap<>();
        String[] days = {"T2", "T3", "T4", "T5", "T6", "T7", "CN"};
        for (String d : days) {
            donationsByDay.put(d, 0);
            requestsByDay.put(d, 0);
        }

        // Lấy danh sách hiến máu trong tuần (lọc theo ngày appointment)
        List<DonationProcess> donations = donationService.getAllDonationProcessesRaw();
        for (DonationProcess donation : donations) {
            if (donation.getDonationAppointment() != null && donation.getDonationAppointment().getAppointmentDate() != null) {
                LocalDate date = donation.getDonationAppointment().getAppointmentDate();
                if (!date.isBefore(startOfWeek) && !date.isAfter(endOfWeek)) {
                    String dayLabel = getDayLabel(date.getDayOfWeek());
                    donationsByDay.put(dayLabel, donationsByDay.getOrDefault(dayLabel, 0) + 1);
                }
            }
        }

        // Lấy danh sách yêu cầu máu trong tuần
        List<BloodRequest> requests = bloodRequestService.getAllRequestsRaw();
        for (BloodRequest req : requests) {
            if (req.getCreatedAt() != null) {
                LocalDate date = req.getCreatedAt().toLocalDate();
                if (!date.isBefore(startOfWeek) && !date.isAfter(endOfWeek)) {
                    String dayLabel = getDayLabel(date.getDayOfWeek());
                    requestsByDay.put(dayLabel, requestsByDay.getOrDefault(dayLabel, 0) + 1);
                }
            }
        }

        List<Map<String, Object>> weeklyData = new ArrayList<>();
        for (String d : days) {
            Map<String, Object> item = new HashMap<>();
            item.put("day", d);
            item.put("donations", donationsByDay.get(d));
            item.put("requests", requestsByDay.get(d));
            weeklyData.add(item);
        }

        int totalDonations = donationsByDay.values().stream().mapToInt(Integer::intValue).sum();
        int totalRequests = requestsByDay.values().stream().mapToInt(Integer::intValue).sum();
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalDonations", totalDonations);
        summary.put("totalRequests", totalRequests);

        Map<String, Object> result = new HashMap<>();
        result.put("weeklyData", weeklyData);
        result.put("summary", summary);
        return ResponseEntity.ok(result);
    }

    // Hàm chuyển DayOfWeek sang label tiếng Việt
    private String getDayLabel(DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return "T2";
            case TUESDAY: return "T3";
            case WEDNESDAY: return "T4";
            case THURSDAY: return "T5";
            case FRIDAY: return "T6";
            case SATURDAY: return "T7";
            case SUNDAY: return "CN";
            default: return "";
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeBloodRequests", 12);
        stats.put("todayDonations", 8);
        stats.put("newRegistrations", 18);
        stats.put("totalBloodUnits", 156);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/quick-stats")
    public ResponseEntity<?> getQuickStats() {
        Map<String, Object> quickStats = new HashMap<>();
        quickStats.put("pendingAppointments", 5);
        quickStats.put("completedDonations", 20);
        quickStats.put("availableBloodUnits", 156);
        quickStats.put("activeRequests", 12);
        quickStats.put("totalDonors", 100);
        quickStats.put("emergencyRequests", 2);
        return ResponseEntity.ok(quickStats);
    }
}
