package com.hicode.backend.controller;

import com.hicode.backend.dto.*;
import com.hicode.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * API Bước 1: Nhận thông tin đăng ký (JSON) và ảnh CCCD, sau đó gửi OTP.
     */
    /**
     * API Bước 1: Sửa lại để chỉ nhận JSON và gửi OTP.
     */
    @PostMapping("/register")
    public ResponseEntity<String> requestRegistration(
            @Valid @RequestBody RegisterRequest registerRequest) {
        try {
            authService.requestRegistration(registerRequest);
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
            return ResponseEntity.status(401).body("Kiểm tra lại thông tin đăng nhập: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.handleForgotPassword(request.getEmail());
        // Luôn trả về OK để bảo mật, tránh để lộ email nào đã đăng ký
        return ResponseEntity.ok("Nếu tài khoản tồn tại, một email đặt lại mật khẩu đã được gửi đi.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok("Mật khẩu đã được đặt lại thành công.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam("token") String token) {
        boolean isValid = authService.validatePasswordResetToken(token);
        if (isValid) {
            return ResponseEntity.ok("Token hợp lệ.");
        } else {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn.");
        }
    }
}