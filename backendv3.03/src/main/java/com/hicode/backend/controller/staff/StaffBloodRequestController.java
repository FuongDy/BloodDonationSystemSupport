// TẠO FILE MỚI: src/main/java/com/hicode/backend/controller/StaffBloodRequestController.java
package com.hicode.backend.controller.staff;

import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/staff/blood-requests")
public class StaffBloodRequestController {
    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping
    public ResponseEntity<BloodRequestResponse> createRequest(@Valid @RequestBody CreateBloodRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bloodRequestService.createRequest(request));
    }

    @GetMapping
    public ResponseEntity<Page<BloodRequestResponse>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bloodRequestService.getAllRequests(pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BloodRequestResponse> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus newStatus) {
        return ResponseEntity.ok(bloodRequestService.updateStatus(id, newStatus));
    }
}