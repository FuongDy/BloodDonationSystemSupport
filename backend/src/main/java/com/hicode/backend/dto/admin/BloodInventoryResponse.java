package com.hicode.backend.dto.admin;

import lombok.Data;
import java.util.List;

@Data
public class BloodInventoryResponse {
    private long totalUnits;
    private List<CriticalLevel> criticalLevels;
    private List<BloodTypeInventory> byBloodType;

    @Data
    public static class CriticalLevel {
        private String bloodType;
        private long units;
        private String status;
    }

    @Data
    public static class BloodTypeInventory {
        private String bloodType;
        private long units;
        private String status;
    }
}