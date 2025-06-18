package com.hicode.backend.model.entity;

import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.model.enums.UrgencyLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
@Getter
@Setter
@NoArgsConstructor
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String patientName; // Tên bệnh nhân

    @Column(columnDefinition = "NVARCHAR(255)")
    private String hospital; // Bệnh viện yêu cầu

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id", nullable = false)
    private BloodType bloodType;

    @Column(nullable = false)
    private Integer quantityInUnits; // Số lượng đơn vị máu cần

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UrgencyLevel urgency;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private RequestStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_staff_id", nullable = false)
    private User createdBy; // Nhân viên tạo yêu cầu

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = RequestStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}