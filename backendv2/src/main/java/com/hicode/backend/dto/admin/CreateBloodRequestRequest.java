package com.hicode.backend.dto.admin;
import com.hicode.backend.model.enums.UrgencyLevel;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class CreateBloodRequestRequest {
    @NotNull private Integer bloodTypeId;
    @NotNull private Integer quantityInUnits;
    @NotNull private UrgencyLevel urgency;
    private String reason;
    private String contactPhone;
    private String deliveryAddress;
    @NotNull private Double latitude;
    @NotNull private Double longitude;
}