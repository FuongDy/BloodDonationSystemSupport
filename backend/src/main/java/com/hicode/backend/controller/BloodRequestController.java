package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.entity.DonationPledge;
import com.hicode.backend.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    // Staff/Admin tạo yêu cầu
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<BloodRequest> createRequest(@Valid @RequestBody CreateBloodRequestRequest request) {
        BloodRequest newRequest = bloodRequestService.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
    }

    // --- CÁC ENDPOINT MỚI ---

    // Member tìm kiếm các yêu cầu đang hoạt động
    @GetMapping("/search/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BloodRequest>> searchActiveRequests() {
        return ResponseEntity.ok(bloodRequestService.searchActiveRequests());
    }

    // Member/Staff/Admin xem chi tiết một yêu cầu
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BloodRequest> getRequestDetails(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.getRequestById(id));
    }

    // Member đăng ký hiến cho một yêu cầu
    @PostMapping("/{requestId}/pledge")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DonationPledge> pledgeToDonate(@PathVariable Long requestId) {
        DonationPledge pledge = bloodRequestService.pledgeForRequest(requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(pledge);
    }
}