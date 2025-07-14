//TẠO FILE MỚI: src/main/java/com/hicode/backend/controller/StaffAppointmentController.java
package com.hicode.backend.controller.staff;

import com.hicode.backend.dto.admin.AppointmentResponse;
import com.hicode.backend.dto.admin.CreateAppointmentRequest;
import com.hicode.backend.dto.admin.RescheduleRequest;
import com.hicode.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff/appointments")
public class StaffAppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentResponse newAppointment = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAppointment);
    }

    @PutMapping("/{id}/request-reschedule")
    public ResponseEntity<Void> requestReschedule(
            @PathVariable Long id, @Valid @RequestBody RescheduleRequest request) {
        appointmentService.requestReschedule(id, request);
        return ResponseEntity.ok().build();
    }
}