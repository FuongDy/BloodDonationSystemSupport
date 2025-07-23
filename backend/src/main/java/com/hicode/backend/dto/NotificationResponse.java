package com.hicode.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String type;
    private String priority;
    private LocalDateTime createdDate;
    private boolean isRead;
    private String actionUrl;
}