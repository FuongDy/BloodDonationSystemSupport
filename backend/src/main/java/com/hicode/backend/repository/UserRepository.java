package com.hicode.backend.repository;

import com.hicode.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
    List<User> findByBloodTypeId(Integer bloodTypeId);

    @Query(value = "SELECT u FROM User u WHERE u.bloodType.id = :bloodTypeId AND u.isReadyToDonate = true AND " +
            "( 6371 * acos( cos( radians(:latitude) ) * cos( radians( u.latitude ) ) * " +
            "cos( radians( u.longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * " +
            "sin( radians( u.latitude ) ) ) ) < :distanceInKm")
    List<User> findDonorsInRadius(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("distanceInKm") double distanceInKm,
            @Param("bloodTypeId") Integer bloodTypeId
    );
}