package com.hicode.backend.repository;

import com.hicode.backend.model.entity.DonationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationAppointmentRepository extends JpaRepository<DonationAppointment, Long> {
}