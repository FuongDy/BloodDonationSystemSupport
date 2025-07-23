package com.hicode.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/dashboard")
public class UserDashboardController {

    @GetMapping("/stats")
    public ResponseEntity<?> getUserDashboardStats() {
        // Implementation for user stats
        return ResponseEntity.ok().build();
    }
}