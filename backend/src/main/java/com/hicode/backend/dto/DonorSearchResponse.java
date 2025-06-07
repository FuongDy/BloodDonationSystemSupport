package com.hicode.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DonorSearchResponse {
    private UserResponse user; // Thông tin chi tiết của người hiến máu
    private double distanceInKm; // Khoảng cách tính bằng km
}
