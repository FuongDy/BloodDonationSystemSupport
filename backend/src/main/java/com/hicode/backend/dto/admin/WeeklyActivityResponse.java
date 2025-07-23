package com.hicode.backend.dto.admin;

import lombok.Data;
import java.util.List;

@Data
public class WeeklyActivityResponse {
    private List<WeeklyDataItem> weeklyData;

    @Data
    public static class WeeklyDataItem {
        private String name;
        private long donations;
        private long appointments;
        private long requests;
    }
}