// TẠO FILE MỚI: src/main/java/com/hicode/backend/controller/AdminDonationController.java
package com.hicode.backend.controller.admin;

import com.hicode.backend.dto.admin.*;
import com.hicode.backend.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/donations")
public class AdminDonationController {

    @Autowired
    private DonationService donationService;

    @GetMapping("/requests")
    public ResponseEntity<List<DonationProcessResponse>> getAllDonationRequests() {
        return ResponseEntity.ok(donationService.getAllDonationRequests());
    }

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<DonationProcessResponse> updateRequestStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateDonationStatusRequest request) {
        return ResponseEntity.ok(donationService.updateDonationStatus(id, request));
    }

    @PostMapping("/{processId}/health-check")
    public ResponseEntity<DonationProcessResponse> recordHealthCheck(
            @PathVariable Long processId, @Valid @RequestBody HealthCheckRequest request) {
        return ResponseEntity.ok(donationService.recordHealthCheck(processId, request));
    }

    @PostMapping("/{processId}/collect")
    public ResponseEntity<DonationProcessResponse> markAsCollected(
            @PathVariable Long processId, @Valid @RequestBody CollectionInfoRequest request) {
        return ResponseEntity.ok(donationService.markBloodAsCollected(processId, request));
    }

    @PostMapping("/{processId}/test-result")
    public ResponseEntity<DonationProcessResponse> recordBloodTestResult(
            @PathVariable Long processId, @Valid @RequestBody BloodTestResultRequest request) {
        return ResponseEntity.ok(donationService.recordBloodTestResult(processId, request));
    }
}