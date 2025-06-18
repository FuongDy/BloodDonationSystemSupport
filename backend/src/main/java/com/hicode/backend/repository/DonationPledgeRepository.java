package com.hicode.backend.repository;

import com.hicode.backend.entity.DonationPledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationPledgeRepository extends JpaRepository<DonationPledge, Long> {
}