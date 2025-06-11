package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate; // <-- Thêm import này

@Getter
@Setter
public class AdminCreateUserRequest {

    @NotBlank
    @Size(min = 3, max = 100)
    private String username;

    @NotBlank
    @Email
    @Size(max = 150)
    private String email;

    @NotBlank
    @Size(min = 3, max = 150)
    private String fullName;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    private String roleName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private Integer bloodTypeId;
    private String phone;
    private String status;
    private Boolean emailVerified;
    private Boolean phoneVerified;
}