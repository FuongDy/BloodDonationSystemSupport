package com.hicode.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, unique = true, nullable = false)
    private String username;

    @Column(length = 150, unique = true, nullable = false)
    private String email;

    @Column(length = 255, nullable = false)
    private String passwordHash;

    @Column(length = 150, nullable = false, columnDefinition = "NVARCHAR(150)")
    private String fullName;

    @Column(length = 20, nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String address;

    private Double latitude;
    private Double longitude;

    @Column(length = 255)
    private String emergencyContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    @JsonBackReference
    private BloodType bloodType;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String medicalConditions;

    private LocalDate lastDonationDate;

    @Column(columnDefinition = "BIT DEFAULT 1")
    private Boolean isReadyToDonate = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(length = 20)
    private String status = "Active";

    @Column(columnDefinition = "BIT DEFAULT 0")
    private Boolean emailVerified = false;

    @Column(columnDefinition = "BIT DEFAULT 0")
    private Boolean phoneVerified = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { this.createdAt = this.updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}