package com.hicode.backend.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.model.enums.DonationStatus;
import com.hicode.backend.model.enums.DonationType;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentResponse {
    private Long id;
    private Long processId;
    private UserResponse donor;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate appointmentDate;

    private String location;
    private UserResponse staff;
    private String notes;
    
    // Thông tin từ donation process
    private DonationStatus status;
    private DonationType donationType;
    private String processNote;
    private Integer collectedVolumeMl;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime updatedAt;
}