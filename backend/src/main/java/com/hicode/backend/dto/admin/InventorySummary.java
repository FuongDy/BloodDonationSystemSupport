package com.hicode.backend.dto.admin;

import com.hicode.backend.model.entity.BloodType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventorySummary {
    private BloodTypeResponse bloodType;
    private long unitCount;
    private long totalVolumeMl;

    public InventorySummary(BloodType bloodType, long unitCount, Long totalVolumeMl) {

        BloodTypeResponse btResponse = new BloodTypeResponse();
        btResponse.setId(bloodType.getId());
        btResponse.setBloodGroup(bloodType.getBloodGroup());

        this.bloodType = btResponse;
        this.unitCount = unitCount;
        this.totalVolumeMl = (totalVolumeMl != null) ? totalVolumeMl : 0L;
    }
}
