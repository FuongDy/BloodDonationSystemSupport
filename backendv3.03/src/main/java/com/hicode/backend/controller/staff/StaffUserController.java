// TẠO FILE MỚI: src/main/java/com/hicode/backend/controller/StaffUserController.java
package com.hicode.backend.controller.staff;

import com.hicode.backend.dto.LocationSearchRequest;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/staff/users")
public class StaffUserController {

    @Autowired
    private UserService userService;

    @PostMapping("/search/donors-by-location")
    public ResponseEntity<List<UserResponse>> searchDonorsByLocation(@Valid @RequestBody LocationSearchRequest request) {
        List<UserResponse> donors = userService.searchDonorsByLocation(request);
        return ResponseEntity.ok(donors);
    }
}