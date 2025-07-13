package com.hicode.backend.controller;

import com.hicode.backend.dto.OcrDataDTO;
import com.hicode.backend.dto.UserResponse; // THÊM IMPORT
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.UserRepository;
import com.hicode.backend.service.OcrValidationService;
import com.hicode.backend.service.StorageService;
import com.hicode.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class FileUploadController {

    @Autowired
    private StorageService storageService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OcrValidationService ocrValidationService;

    /**
     * API này sẽ tải lên, xác thực và cập nhật thông tin CCCD cho user
     */
    @PostMapping("/me/upload-id-card")
    @PreAuthorize("isAuthenticated()")
    // THAY ĐỔI KIỂU TRẢ VỀ TỪ String SANG Object (?) ĐỂ LINH HOẠT
    public ResponseEntity<?> uploadIdCard(
            @RequestParam("frontImage") MultipartFile frontImage,
            @RequestParam("backImage") MultipartFile backImage) {

        try {
            User currentUser = userService.getCurrentUser();

            String frontImageUrl = storageService.store(frontImage);
            String backImageUrl = storageService.store(backImage);

            OcrDataDTO ocrData = ocrValidationService.verifyAndExtractIdCardDataAgainstUser(frontImage, currentUser);

            currentUser.setIdCardFrontUrl(frontImageUrl);
            currentUser.setIdCardBackUrl(backImageUrl);
            currentUser.setIdCardNumber(ocrData.getId());
            currentUser.setIdCardVerified(true);

            User updatedUser = userRepository.save(currentUser);

            // Ánh xạ người dùng đã cập nhật sang UserResponse
            UserResponse userResponse = userService.mapToUserResponse(updatedUser);

            // Trả về toàn bộ hồ sơ người dùng đã được cập nhật
            return ResponseEntity.ok(userResponse);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}