package com.hicode.backend.dto.admin;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActiveDonorResponse {
    private Long id;
    private String name;
    private long totalDonations;
    private String bloodType;
    private LocalDateTime lastDonation;
    private String status;
}