package com.hicode.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
// Sửa lại Table: Bỏ uniqueConstraints cũ
@Table(name = "blood_types")
@Getter
@Setter
@NoArgsConstructor
public class BloodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(name = "blood_group", length = 3, nullable = false, unique = true)
    private String bloodGroup;

    @Column(length = 50, nullable = true)
    private String description;

    @OneToMany(mappedBy = "bloodType", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<User> users;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
        // Xóa bỏ: Các giá trị mặc định cho componentType và shelfLifeDays
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}