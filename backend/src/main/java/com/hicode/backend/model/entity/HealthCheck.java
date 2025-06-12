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
    private Boolean isEligible;

    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Double hemoglobinLevel;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(updatable = false)
    private LocalDateTime checkDate;

    @PrePersist
    protected void onPrePersist() {
        this.checkDate = LocalDateTime.now();
    }
}