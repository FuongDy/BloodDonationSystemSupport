package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.dto.LocationSearchRequest;
import com.hicode.backend.model.enums.RequestStatus;
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

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<BloodRequestResponse> createRequest(@Valid @RequestBody CreateBloodRequestRequest request) {
        BloodRequestResponse createdRequest = bloodRequestService.createBloodRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }

    @PostMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BloodRequestResponse>> searchActiveRequests(@Valid @RequestBody LocationSearchRequest request) {
        List<BloodRequestResponse> requests = bloodRequestService.searchActiveRequests(request);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BloodRequestResponse> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.getRequestById(id));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelRequest(@PathVariable Long id) {
        bloodRequestService.cancelRequest(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BloodRequestResponse> updateRequestStatus(@PathVariable Long id, @RequestParam RequestStatus status) {
        return ResponseEntity.ok(bloodRequestService.updateRequestStatus(id, status));
    }
}