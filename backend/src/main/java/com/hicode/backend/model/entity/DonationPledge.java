package com.hicode.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_pledges")
@Getter
@Setter
@NoArgsConstructor
public class DonationPledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết đến User đã đăng ký hiến
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    // Liên kết đến Yêu cầu máu mà User này đăng ký hiến
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_request_id", nullable = false)
    private BloodRequest bloodRequest;

    // Dùng để theo dõi trạng thái của chính lần đăng ký này
    // Ví dụ: Đã đăng ký -> Đã được hẹn -> Đã hoàn thành hiến...
    @Column(length = 50)
    private String status;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}