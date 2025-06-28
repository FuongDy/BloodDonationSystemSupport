package com.hicode.backend.controller;

import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.UserRepository;
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

    @PostMapping("/me/upload-id-card")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadIdCard(
            @RequestParam("frontImage") MultipartFile frontImage,
            @RequestParam("backImage") MultipartFile backImage) {

        User currentUser = userService.getCurrentUser();

        // Lưu ảnh mặt trước và mặt sau
        String frontImageUrl = storageService.store(frontImage);
        String backImageUrl = storageService.store(backImage);

        // Cập nhật đường dẫn vào User
        currentUser.setIdCardFrontUrl(frontImageUrl);
        currentUser.setIdCardBackUrl(backImageUrl);
        userRepository.save(currentUser);

        // Ở đây, bạn có thể gọi đến một service OCR để bắt đầu quá trình đối chiếu
        // ocrService.verifyIdCard(currentUser, frontImageUrl, backImageUrl);

        return ResponseEntity.ok("ID card images uploaded successfully. Verification is in progress.");
    }
}