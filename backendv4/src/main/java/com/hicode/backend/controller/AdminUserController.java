package com.hicode.backend.controller;

import com.hicode.backend.dto.admin.AdminCreateUserRequest;
import com.hicode.backend.dto.admin.AdminUpdateUserRequest;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = sort.length > 0 ? sort[0] : "id";

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUserByAdmin(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUserByAdmin(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserByIdForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserByIdForAdmin(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUserByAdmin(@PathVariable Long id, @Valid @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUserByAdmin(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponse> softDeleteUserByAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.softDeleteUserByAdmin(id));
    }
}