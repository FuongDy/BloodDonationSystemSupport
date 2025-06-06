package com.hicode.backend.repository;

import com.hicode.backend.entity.BloodType;
import com.hicode.backend.entity.BloodComponentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodTypeRepository extends JpaRepository<BloodType, Integer>, JpaSpecificationExecutor<BloodType> {
    Optional<BloodType> findByBloodGroupAndComponentType(String bloodGroup, BloodComponentType componentType);
    List<BloodType> findAllByActiveTrue();
}