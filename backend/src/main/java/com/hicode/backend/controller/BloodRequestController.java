// SỬA FILE: src/main/java/com/hicode/backend/controller/BloodRequestController.java
package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.model.entity.DonationPledge;
import com.hicode.backend.service.BloodRequestService;
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

    @GetMapping("/search/active")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<BloodRequestResponse>> searchActiveRequests() {
        return ResponseEntity.ok(bloodRequestService.searchActiveRequests());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BloodRequestResponse> getRequestDetails(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.getRequestById(id));
    }

    @PostMapping("/{requestId}/pledge")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DonationPledge> pledgeToDonate(@PathVariable Long requestId) {
        DonationPledge pledge = bloodRequestService.pledgeForRequest(requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(pledge);
    }
}