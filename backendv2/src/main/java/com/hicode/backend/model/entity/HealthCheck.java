package com.hicode.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_checks")
@Getter
@Setter
@NoArgsConstructor
public class HealthCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false, unique = true)
    private DonationProcess donationProcess;

    @Column(nullable = false)
    private Boolean isEligible; // True = đủ điều kiện, False = không đủ

    private Integer bloodPressureSystolic; // Huyết áp tâm thu
    private Integer bloodPressureDiastolic; // Huyết áp tâm trương
    private Double hemoglobinLevel; // Nồng độ hemoglobin

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String notes; // Ghi chú của nhân viên y tế

    @Column(updatable = false)
    private LocalDateTime checkDate;

    @PrePersist
    protected void onPrePersist() {
        this.checkDate = LocalDateTime.now();
    }
}