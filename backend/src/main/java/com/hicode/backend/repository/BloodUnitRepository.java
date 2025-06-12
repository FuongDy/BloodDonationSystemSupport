package com.hicode.backend.repository;

import com.hicode.backend.model.entity.BloodUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodUnitRepository extends JpaRepository<BloodUnit, String> {}