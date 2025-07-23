package com.hicode.backend.repository;

import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    @Query("SELECT br FROM BloodRequest br JOIN FETCH br.bloodType JOIN FETCH br.createdBy")
    List<BloodRequest> findAllWithDetails();

    @Query("SELECT br FROM BloodRequest br JOIN FETCH br.bloodType JOIN FETCH br.createdBy WHERE br.status = :status")
    List<BloodRequest> findByStatusWithDetails(@Param("status") RequestStatus status);

    @Query("SELECT br FROM BloodRequest br JOIN FETCH br.bloodType JOIN FETCH br.createdBy WHERE br.status = :status")
    Page<BloodRequest> findByStatus(@Param("status") RequestStatus status, Pageable pageable);

    @Override
    @Query(value = "SELECT br FROM BloodRequest br JOIN FETCH br.bloodType JOIN FETCH br.createdBy",
            countQuery = "SELECT count(br) FROM BloodRequest br")
    Page<BloodRequest> findAll(Pageable pageable);

    @Query("SELECT br FROM BloodRequest br LEFT JOIN FETCH br.pledges WHERE br.id = :id")
    Optional<BloodRequest> findByIdWithPledges(@Param("id") Long id);

    long countByRoomNumberAndStatus(Integer roomNumber, RequestStatus status);

    boolean existsByRoomNumberAndBedNumberAndStatus(Integer roomNumber, Integer bedNumber, RequestStatus status);

    List<BloodRequest> findByStatus(RequestStatus status);

    List<BloodRequest> findAllByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}