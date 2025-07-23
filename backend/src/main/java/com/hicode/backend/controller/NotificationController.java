package com.hicode.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardNotifications() {
        // Implementation for dashboard notifications
        return ResponseEntity.ok().build();
    }
}