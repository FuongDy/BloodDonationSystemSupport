package com.hicode.backend.controller;

import com.hicode.backend.dto.BloodCompatibilityDetailResponse;
import com.hicode.backend.dto.CreateBloodCompatibilityRequest;
import com.hicode.backend.dto.UpdateBloodCompatibilityRequest;
import com.hicode.backend.service.BloodManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blood-compatibility")
public class BloodCompatibilityController {

    @Autowired
    private BloodManagementService bloodManagementService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Page<BloodCompatibilityDetailResponse>> searchAllCompatibilityRules(
            @RequestParam(required = false) Integer donorTypeId,
            @RequestParam(required = false) Integer recipientTypeId,
            Pageable pageable) {
        Page<BloodCompatibilityDetailResponse> results = bloodManagementService.searchCompatibilityRules(donorTypeId, recipientTypeId, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<BloodCompatibilityDetailResponse> getCompatibilityRuleById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(bloodManagementService.getCompatibilityRuleDetails(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCompatibilityRule(@Valid @RequestBody CreateBloodCompatibilityRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(bloodManagementService.createCompatibilityRule(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            System.err.println("Create Compatibility Rule Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not create compatibility rule: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCompatibilityRule(@PathVariable Integer id, @Valid @RequestBody UpdateBloodCompatibilityRequest request) {
        try {
            return ResponseEntity.ok(bloodManagementService.updateCompatibilityRule(id, request));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            System.err.println("Update Compatibility Rule Error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Could not update compatibility rule: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDeleteCompatibilityRule(@PathVariable Integer id) {
        try {
            BloodCompatibilityDetailResponse deactivatedRule = bloodManagementService.softDeleteCompatibilityRule(id);
            return ResponseEntity.ok(deactivatedRule);
        } catch (RuntimeException e) {
            if (e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            System.err.println("Error deleting compatibility rule: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not delete rule.");
        }
    }
}