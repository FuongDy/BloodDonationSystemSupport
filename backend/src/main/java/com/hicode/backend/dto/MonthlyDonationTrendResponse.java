package com.hicode.backend.dto;

import lombok.Data;

@Data
public class MonthlyDonationTrendResponse {
    private String month;
    private long donations;
    private long target;
    private double growth;
}