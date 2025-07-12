package com.hicode.backend.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hicode.backend.dto.UserResponse;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate; // THAY ĐỔI

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
}