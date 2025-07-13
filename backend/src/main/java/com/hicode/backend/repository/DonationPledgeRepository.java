package com.hicode.backend.repository;

import com.hicode.backend.model.entity.DonationPledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationPledgeRepository extends JpaRepository<DonationPledge, Long> {

    /**
     * PHƯƠNG THỨC MỚI: Đếm số lượt đăng ký cho một yêu cầu máu cụ thể.
     */
    long countByBloodRequestId(Long bloodRequestId);

    /**
     * PHƯƠNG THỨC MỚI: Kiểm tra xem một người dùng đã đăng ký cho một yêu cầu máu hay chưa.
     */
    boolean existsByDonorIdAndBloodRequestId(Long donorId, Long bloodRequestId);
}