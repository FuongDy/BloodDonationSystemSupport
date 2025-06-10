// BloodRequestResponse.java
package com.hicode.backend.dto.admin;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.model.enums.UrgencyLevel;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter @Setter
public class BloodRequestResponse {
    private Long id;
    private UserResponse requester;
    private BloodTypeResponse bloodType;
    private Integer quantityInUnits;
    private UrgencyLevel urgency;
    private RequestStatus status;
    private String reason;
    private String contactPhone;
    private String deliveryAddress;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
}