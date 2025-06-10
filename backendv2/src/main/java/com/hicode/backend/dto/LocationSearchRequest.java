package com.hicode.backend.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class LocationSearchRequest {
    @NotNull private Double latitude;
    @NotNull private Double longitude;
    @NotNull private Double radius; // in km
    private Integer bloodTypeId;
}