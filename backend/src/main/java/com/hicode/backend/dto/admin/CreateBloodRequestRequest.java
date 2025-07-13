package com.hicode.backend.dto.admin;

import com.hicode.backend.model.enums.UrgencyLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBloodRequestRequest {
    @NotBlank
    private String patientName;

    @NotBlank
    private String hospital;

    @NotNull
    private Integer bloodTypeId;

    @NotNull
    @Positive
    private Integer quantityInUnits;

    @NotNull
    private UrgencyLevel urgency;

    @NotNull(message = "Room number is required")
    @Min(value = 1, message = "Room number must be between 1 and 16")
    @Max(value = 16, message = "Room number must be between 1 and 16")
    private Integer roomNumber;

    @NotNull(message = "Bed number is required")
    @Min(value = 1, message = "Bed number must be at least 1")
    @Max(value = 8, message = "Bed number cannot exceed 8")
    private Integer bedNumber;
}