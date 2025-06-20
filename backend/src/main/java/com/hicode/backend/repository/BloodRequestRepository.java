package com.hicode.backend.repository;

import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    @Query("SELECT br FROM BloodRequest br WHERE br.status = :status")
    List<BloodRequest> findByStatusWithDetails(@Param("status") RequestStatus status);
}