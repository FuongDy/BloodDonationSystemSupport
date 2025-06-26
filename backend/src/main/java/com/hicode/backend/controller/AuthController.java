package com.hicode.backend.controller;

import com.hicode.backend.dto.*;
import com.hicode.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Endpoint Bước 1: Gửi yêu cầu đăng ký và nhận OTP
    @PostMapping("/register/request-otp")
    public ResponseEntity<String> requestOtp(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.requestRegistration(registerRequest);
        return ResponseEntity.ok("Verification OTP has been sent to your email. Please check and verify.");
    }

    // Endpoint Bước 2: Xác thực OTP và hoàn tất đăng ký
    @PostMapping("/register/verify")
    public ResponseEntity<String> verifyAndRegister(@Valid @RequestBody VerifyRequest verifyRequest) {
        authService.verifyAndCompleteRegistration(verifyRequest);
        return ResponseEntity.ok("Account verified and registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.loginUser(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("The email or password is invalid");
        }
    }

    @PostMapping("/register/resend-otp")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody ResendOtpRequest resendRequest) {
        authService.resendOtp(resendRequest);
        return ResponseEntity.ok("A new verification OTP has been sent to your email.");
    }
}