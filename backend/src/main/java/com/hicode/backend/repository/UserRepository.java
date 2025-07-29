package com.hicode.backend.repository;

import com.hicode.backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
    List<User> findByBloodTypeId(Integer bloodTypeId);

    List<User> findByIsReadyToDonateFalseAndLastDonationDateIsNotNull();

    List<User> findByLastDonationDate(LocalDate date);

    @Query("SELECT u FROM User u WHERE u.role.name = 'Member' AND " +
            "(:name IS NULL OR u.fullName LIKE %:name%) AND " +
            "(:email IS NULL OR u.email LIKE %:email%)")
    List<User> searchMembers(@Param("name") String name, @Param("email") String email);

    long countByCreatedAtBefore(LocalDateTime date);

    // Simple query to get users who have completed donations
    @Query("SELECT DISTINCT u FROM User u JOIN DonationProcess dp ON u.id = dp.donor.id WHERE dp.status = :status ORDER BY u.createdAt DESC")
    List<User> findUsersByDonationStatus(@Param("status") com.hicode.backend.model.enums.DonationStatus status, org.springframework.data.domain.Pageable pageable);

    Optional<User> findByPasswordResetToken(String token);
}