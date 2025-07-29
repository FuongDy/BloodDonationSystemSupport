package com.hicode.backend.controller.admin;

import com.hicode.backend.dto.admin.ActiveDonorResponse;
import com.hicode.backend.dto.admin.DashboardStatsResponse;
import com.hicode.backend.dto.admin.WeeklyActivityResponse;
import com.hicode.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/weekly-data")
    public ResponseEntity<WeeklyActivityResponse> getWeeklyActivityData() {
        return ResponseEntity.ok(dashboardService.getWeeklyActivityData());
    }

    @GetMapping("/active-donors")
    public ResponseEntity<List<ActiveDonorResponse>> getActiveDonors(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getActiveDonors(limit));
    }
}