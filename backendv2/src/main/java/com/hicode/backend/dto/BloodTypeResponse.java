package com.hicode.backend.dto;

import com.hicode.backend.model.enums.BloodComponentType;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BloodTypeResponse {
    private Integer id;
    private String bloodGroup;
    private BloodComponentType componentType;
    private String description;
    private Integer volumeMl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}