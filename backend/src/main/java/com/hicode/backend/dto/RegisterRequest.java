package com.hicode.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 150)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password need to longer than 6")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Size(min = 9, max = 15, message = "Phone number must be between 9 and 15 characters")
    private String phone;

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 255, message = "Address must be between 10 and 255 characters")
    private String address;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private Integer bloodTypeId;
}