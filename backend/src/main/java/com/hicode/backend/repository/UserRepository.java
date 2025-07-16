package com.hicode.backend.repository;

import com.hicode.backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
}