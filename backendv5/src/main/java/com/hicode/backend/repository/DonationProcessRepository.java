package com.hicode.backend.repository;

import com.hicode.backend.model.entity.DonationProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationProcessRepository extends JpaRepository<DonationProcess, Long> {

    @Query("SELECT dp FROM DonationProcess dp LEFT JOIN FETCH dp.donationAppointment WHERE dp.donor.id = :donorId ORDER BY dp.createdAt DESC")
    List<DonationProcess> findByDonorIdWithAppointment(@Param("donorId") Long donorId);

    @Query("SELECT dp FROM DonationProcess dp LEFT JOIN FETCH dp.donationAppointment ORDER BY dp.createdAt DESC")
    List<DonationProcess> findAllWithAppointment();
}