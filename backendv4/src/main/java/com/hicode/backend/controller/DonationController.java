package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.BloodTestResultRequest;
import com.hicode.backend.dto.DonationProcessResponse;
import com.hicode.backend.dto.admin.HealthCheckRequest;
import com.hicode.backend.dto.admin.UpdateDonationStatusRequest;
import com.hicode.backend.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    // Endpoint cho User đăng ký hiến máu
    @PostMapping("/request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DonationProcessResponse> requestToDonate() {
        return ResponseEntity.status(HttpStatus.CREATED).body(donationService.createDonationRequest());
    }

    // Endpoint cho User xem lịch sử của mình
    @GetMapping("/my-history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DonationProcessResponse>> getMyHistory() {
        return ResponseEntity.ok(donationService.getMyDonationHistory());
    }

    // Endpoint cho Staff/Admin xem tất cả đơn
    @GetMapping("/requests")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<DonationProcessResponse>> getAllRequests() {
        return ResponseEntity.ok(donationService.getAllDonationRequests());
    }

    // Endpoint cho Staff/Admin duyệt hoặc từ chối đơn
    @PutMapping("/requests/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DonationProcessResponse> updateRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDonationStatusRequest request) {
        return ResponseEntity.ok(donationService.updateDonationStatus(id, request));
    }

    // 1. Endpoint để Staff/Admin nhập kết quả khám sàng lọc
    @PostMapping("/{processId}/health-check")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DonationProcessResponse> recordHealthCheck(
            @PathVariable Long processId,
            @Valid @RequestBody HealthCheckRequest request) {
        return ResponseEntity.ok(donationService.recordHealthCheck(processId, request));
    }

    // 2. Endpoint để Staff/Admin xác nhận đã lấy máu
    @PutMapping("/{processId}/collect")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DonationProcessResponse> markAsCollected(@PathVariable Long processId) {
        return ResponseEntity.ok(donationService.markBloodAsCollected(processId));
    }

    // 3. Endpoint để Staff/Admin nhập kết quả xét nghiệm máu
    @PostMapping("/{processId}/test-result")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DonationProcessResponse> recordBloodTestResult(
            @PathVariable Long processId,
            @Valid @RequestBody BloodTestResultRequest request) {
        return ResponseEntity.ok(donationService.recordBloodTestResult(processId, request));
    }
}