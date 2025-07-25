package com.hicode.backend.repository;

import com.hicode.backend.model.entity.BloodTypeCompatibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BloodTypeCompatibilityRepository extends JpaRepository<BloodTypeCompatibility, Integer> {
    Optional<BloodTypeCompatibility> findByDonorBloodTypeIdAndRecipientBloodTypeId(
            Integer donorBloodTypeId, Integer recipientBloodTypeId
    );
    List<BloodTypeCompatibility> findByDonorBloodTypeIdOrRecipientBloodTypeId(Integer donorId, Integer recipientId);

    /**
     * PHƯƠNG THỨC MỚI: Tìm tất cả các quy tắc tương thích dựa vào ID của nhóm máu người nhận.
     */
    List<BloodTypeCompatibility> findByRecipientBloodTypeIdAndIsCompatibleTrue(Integer recipientBloodTypeId);
}