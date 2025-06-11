package com.hicode.backend.repository;

import com.hicode.backend.model.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    @Query(value = "SELECT * FROM blood_requests br WHERE " +
            "br.status = :status AND " +
            "(:bloodTypeId IS NULL OR br.blood_type_id = :bloodTypeId) AND " +
            "( 6371 * acos( cos( radians(:lat) ) * cos( radians( br.latitude ) ) * " +
            "cos( radians( br.longitude ) - radians(:lon) ) + sin( radians(:lat) ) * " +
            "sin( radians( br.latitude ) ) ) ) < :radius", nativeQuery = true)
    List<BloodRequest> findActiveRequestsWithinRadius(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius,
            @Param("bloodTypeId") Integer bloodTypeId,
            @Param("status") String status
    );
}