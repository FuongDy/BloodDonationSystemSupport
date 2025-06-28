package com.hicode.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hicode.backend.dto.*;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.RoleRepository;
import com.hicode.backend.repository.UserRepository;
import com.hicode.backend.repository.VerificationTokenRepository;
import com.hicode.backend.security.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;
    @Autowired private VerificationTokenRepository tokenRepository;
    @Autowired private EmailService emailService;
    @Autowired private StorageService storageService;
    @Autowired private BloodTypeRepository bloodTypeRepository;
    @Autowired private OcrValidationService ocrValidationService;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    /**
     * Bước 1 của quy trình đăng ký: Nhận thông tin, ảnh CCCD, và gửi OTP.
     */
    @Transactional
    public void requestRegistration(String registerRequestJson, MultipartFile frontImage, MultipartFile backImage) throws IOException {

        RegisterRequest registerRequest = objectMapper.readValue(registerRequestJson, RegisterRequest.class);

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        // Bước 1: Gọi OCR để đối chiếu và trích xuất dữ liệu
        OcrDataDTO ocrData = ocrValidationService.verifyAndExtractIdCardData(frontImage, backImage, registerRequest);

        // Bước 2: Tự động cập nhật/chuẩn hóa thông tin từ OCR
        registerRequest.setIdCardNumber(ocrData.getId());
        registerRequest.setHometown(ocrData.getHome());
        registerRequest.setNationality(ocrData.getNationality());
        registerRequest.setGender(ocrData.getSex());
        // Chuẩn hóa lại tên và ngày sinh để khớp 100% với CCCD
        registerRequest.setFullName(ocrData.getName());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        registerRequest.setDateOfBirth(LocalDate.parse(ocrData.getDob(), formatter));

        // Bước 3: Lưu ảnh và cập nhật đường dẫn
        String frontImageUrl = storageService.store(frontImage);
        String backImageUrl = storageService.store(backImage);
        registerRequest.setIdCardFrontUrl(frontImageUrl);
        registerRequest.setIdCardBackUrl(backImageUrl);

        // Bước 4: Mã hóa mật khẩu
        registerRequest.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Bước 5: Tạo và gửi OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        String registrationInfoJson = objectMapper.writeValueAsString(registerRequest);

        VerificationToken verificationToken = tokenRepository.findByEmail(registerRequest.getEmail())
                .orElse(new VerificationToken());

        verificationToken.setEmail(registerRequest.getEmail());
        verificationToken.setToken(otp);
        verificationToken.setUserRegistrationInfo(registrationInfoJson);
        verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        tokenRepository.save(verificationToken);

        String emailBody = "Mã xác thực đăng ký tài khoản của bạn là: " + otp;
        emailService.sendEmail(registerRequest.getEmail(), "Xác thực đăng ký tài khoản", emailBody);
    }

    /**
     * Bước 2: User xác thực OTP để hoàn tất đăng ký.
     */
    @Transactional
    public User verifyAndCompleteRegistration(VerifyRequest verifyRequest) {
        VerificationToken token = tokenRepository.findByEmail(verifyRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Invalid or expired verification request. Please register again."));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new IllegalStateException("OTP has expired. Please register again.");
        }
        if (!token.getToken().equals(verifyRequest.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP code.");
        }

        try {
            RegisterRequest registrationInfo = objectMapper.readValue(token.getUserRegistrationInfo(), RegisterRequest.class);

            User user = new User();
            user.setIdCardNumber(registrationInfo.getIdCardNumber()); // Gán số CCCD
            user.setHometown(registrationInfo.getHometown());       // Gán quê quán
            user.setFullName(registrationInfo.getFullName());
            user.setEmail(registrationInfo.getEmail());
            user.setUsername(registrationInfo.getEmail());
            user.setPasswordHash(registrationInfo.getPassword());
            user.setPhone(registrationInfo.getPhone());
            user.setAddress(registrationInfo.getAddress());
            user.setDateOfBirth(registrationInfo.getDateOfBirth());
            user.setLatitude(registrationInfo.getLatitude());
            user.setLongitude(registrationInfo.getLongitude());
            user.setStatus(UserStatus.ACTIVE);
            user.setEmailVerified(true);

            // Gán URL ảnh CCCD đã được lưu trong thông tin tạm thời
            user.setIdCardFrontUrl(registrationInfo.getIdCardFrontUrl());
            user.setIdCardBackUrl(registrationInfo.getIdCardBackUrl());

            IdCardVerification verification = new IdCardVerification();
            verification.setUser(user);
            verification.setStatus(VerificationStatus.VERIFIED);
            verification.setVerifiedAt(LocalDateTime.now());
            user.setIdCardVerification(verification);

            Role userRole = roleRepository.findByName("Member").orElseThrow(() -> new RuntimeException("Error: Role 'Member' not found."));
            user.setRole(userRole);

            if (registrationInfo.getBloodTypeId() != null) {
                bloodTypeRepository.findById(registrationInfo.getBloodTypeId()).ifPresent(user::setBloodType);
            }

            User savedUser = userRepository.save(user);
            tokenRepository.delete(token);
            return savedUser;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error reading registration data.", e);
        }
    }

    @Transactional
    public void resendOtp(ResendOtpRequest resendRequest) {
        VerificationToken token = tokenRepository.findByEmail(resendRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("No pending registration found for this email."));

        String newOtp = String.format("%06d", new Random().nextInt(999999));
        token.setToken(newOtp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        tokenRepository.save(token);

        String emailBody = "Mã xác thực mới của bạn là: " + newOtp + ".";
        emailService.sendEmail(resendRequest.getEmail(), "Yêu cầu gửi lại mã OTP", emailBody);
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + loginRequest.getEmail()));
        return new AuthResponse(jwt, user.getId(), user.getEmail(), user.getFullName(), user.getRole().getName());
    }
}