package com.hicode.backend.service;

import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.BloodRequestRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;
    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private UserService userService;

    @Transactional
    public BloodRequest createRequest(CreateBloodRequestRequest request) {
        User currentStaff = userService.getCurrentUser();
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found."));

        BloodRequest newRequest = new BloodRequest();
        newRequest.setPatientName(request.getPatientName());
        newRequest.setHospital(request.getHospital());
        newRequest.setBloodType(bloodType);
        newRequest.setQuantityInUnits(request.getQuantityInUnits());
        newRequest.setUrgency(request.getUrgency());
        newRequest.setCreatedBy(currentStaff);

        return bloodRequestRepository.save(newRequest);
    }
}