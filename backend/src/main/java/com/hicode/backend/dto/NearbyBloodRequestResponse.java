package com.hicode.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NearbyBloodRequestResponse {
    private Long id;
    private String bloodType;
    private int unitsNeeded;
    private String hospitalName;
    private double distance;
    private String urgencyLevel;
    private LocalDateTime requestDate;
    private String description;
}