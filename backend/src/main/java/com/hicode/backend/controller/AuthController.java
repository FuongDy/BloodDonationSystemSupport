package com.hicode.backend.controller;

import com.hicode.backend.dto.AuthResponse;
import com.hicode.backend.dto.LoginRequest;
import com.hicode.backend.dto.ResendOtpRequest;
import com.hicode.backend.dto.VerifyRequest;
import com.hicode.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * API Bước 1: Nhận thông tin đăng ký (JSON) và ảnh CCCD, sau đó gửi OTP.
     */
    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<String> requestRegistration(
            @RequestParam("registrationData") String registerRequestJson,
            @RequestParam("frontImage") MultipartFile frontImage,
            @RequestParam("backImage") MultipartFile backImage) {
        try {
            authService.requestRegistration(registerRequestJson, frontImage, backImage);
            return ResponseEntity.ok("Verification OTP has been sent to your email. Please check and verify.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * API Bước 2: Xác thực OTP và hoàn tất đăng ký.
     */
    @PostMapping("/register/verify")
    public ResponseEntity<String> verifyAndRegister(@Valid @RequestBody VerifyRequest verifyRequest) {
        try {
            authService.verifyAndCompleteRegistration(verifyRequest);
            return ResponseEntity.ok("Account verified and registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API gửi lại OTP.
     */
    @PostMapping("/register/resend-otp")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody ResendOtpRequest resendRequest) {
        try {
            authService.resendOtp(resendRequest);
            return ResponseEntity.ok("A new verification OTP has been sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API đăng nhập.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.loginUser(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }
}