package com.hicode.backend.repository;

import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationProcessRepository extends JpaRepository<DonationProcess, Long> {

    @Query("SELECT dp FROM DonationProcess dp " +
            "LEFT JOIN FETCH dp.donationAppointment " +
            "LEFT JOIN FETCH dp.healthCheck " + // Thêm JOIN FETCH cho HealthCheck
            "WHERE dp.donor.id = :donorId ORDER BY dp.createdAt DESC")
    List<DonationProcess> findByDonorIdWithDetails(@Param("donorId") Long donorId);

    @Query("SELECT dp FROM DonationProcess dp " +
            "LEFT JOIN FETCH dp.donationAppointment " +
            "LEFT JOIN FETCH dp.healthCheck " + // Thêm JOIN FETCH cho HealthCheck
            "ORDER BY dp.createdAt DESC")
    List<DonationProcess> findAllWithDetails();

    List<DonationProcess> findAllByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // Kiểm tra xem người dùng đã từng hiến máu với các trạng thái cụ thể
    boolean existsByDonorIdAndStatusIn(Long donorId, List<DonationStatus> statuses);
    
    // Đếm số lượng theo trạng thái
    long countByStatus(DonationStatus status);
    long countByStatusAndCreatedAtBefore(DonationStatus status, LocalDateTime date);
    
    // Đếm số lần hiến máu của một người dùng theo trạng thái
    long countByDonorIdAndStatus(Long donorId, DonationStatus status);
    
    // Lấy lần hiến máu gần nhất của một người dùng
    @Query("SELECT dp FROM DonationProcess dp WHERE dp.donor.id = :donorId AND dp.status = :status ORDER BY dp.createdAt DESC")
    List<DonationProcess> findTopByDonorIdAndStatusOrderByCreatedAtDesc(@Param("donorId") Long donorId, @Param("status") DonationStatus status, org.springframework.data.domain.Pageable pageable);
}