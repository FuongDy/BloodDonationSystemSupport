package com.hicode.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBloodTypeRequest {
    @NotBlank
    @Size(max = 3)
    private String bloodGroup;


    @Size(max = 50)
    private String description;

    @NotNull
    @Positive
    private Integer shelfLifeDays;
}