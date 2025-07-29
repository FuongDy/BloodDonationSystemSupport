package com.hicode.backend.repository;

import com.hicode.backend.model.entity.DonationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationAppointmentRepository extends JpaRepository<DonationAppointment, Long> {
    @Query("SELECT da FROM DonationAppointment da " +
           "LEFT JOIN FETCH da.donationProcess dp " +
           "LEFT JOIN FETCH dp.donor " +
           "LEFT JOIN FETCH da.staff " +
           "WHERE dp.donor.id = :donorId " +
           "ORDER BY da.appointmentDate DESC")
    List<DonationAppointment> findByDonorId(@Param("donorId") Long donorId);

    List<DonationAppointment> findAllByAppointmentDateBetween(LocalDate start, LocalDate end);
    
    // Methods for dashboard stats
    long countByAppointmentDateBefore(LocalDate date);
}