// SỬA FILE: src/main/java/com/hicode/backend/controller/DonationController.java
package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.DonationProcessResponse;
import com.hicode.backend.service.DonationService;
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

    @PostMapping("/request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DonationProcessResponse> requestToDonate() {
        return ResponseEntity.status(HttpStatus.CREATED).body(donationService.createDonationRequest());
    }

    @GetMapping("/my-history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DonationProcessResponse>> getMyHistory() {
        return ResponseEntity.ok(donationService.getMyDonationHistory());
    }
}