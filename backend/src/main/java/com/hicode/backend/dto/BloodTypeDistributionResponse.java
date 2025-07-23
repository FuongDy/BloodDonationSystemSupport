package com.hicode.backend.dto;

import lombok.Data;

@Data
public class BloodTypeDistributionResponse {
    private String bloodType;
    private long count;
    private double percentage;
}