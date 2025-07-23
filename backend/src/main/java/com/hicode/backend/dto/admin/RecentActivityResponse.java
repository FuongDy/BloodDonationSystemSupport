package com.hicode.backend.dto.admin;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RecentActivityResponse {
    private Long id;
    private String type;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String description;
    private LocalDateTime timestamp;
    private String status;
}