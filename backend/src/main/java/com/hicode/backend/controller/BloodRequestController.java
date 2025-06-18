package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<BloodRequest> createRequest(@Valid @RequestBody CreateBloodRequestRequest request) {
        BloodRequest newRequest = bloodRequestService.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
    }
}