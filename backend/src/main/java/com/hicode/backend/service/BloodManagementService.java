package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.dto.admin.*;
import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodManagementService {

    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    public List<BloodTypeResponse> getAllBloodTypes() {
        return bloodTypeRepository.findAll().stream()
                .map(this::mapToBloodTypeResponse)
                .collect(Collectors.toList());
    }

    public BloodTypeResponse getBloodTypeDetails(Integer id) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found with id: " + id));
        return mapToBloodTypeResponse(bloodType);
    }

    @Transactional
    public BloodTypeResponse createBloodType(CreateBloodTypeRequest request) {
        // Sửa lại logic: chỉ kiểm tra theo bloodGroup
        Optional<BloodType> existing = bloodTypeRepository.findByBloodGroup(request.getBloodGroup());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Blood type with group '" + request.getBloodGroup() + "' already exists.");
        }
        BloodType bloodType = new BloodType();
        BeanUtils.copyProperties(request, bloodType);
        BloodType savedBloodType = bloodTypeRepository.save(bloodType);
        return mapToBloodTypeResponse(savedBloodType);
    }

    @Transactional
    public BloodTypeResponse updateBloodType(Integer id, UpdateBloodTypeRequest request) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found with id: " + id));

        if (request.getDescription() != null) {
            bloodType.setDescription(request.getDescription());
        }

        BloodType updatedBloodType = bloodTypeRepository.save(bloodType);
        return mapToBloodTypeResponse(updatedBloodType);
    }

    @Transactional
    public void deleteBloodType(Integer id) {
        if (!bloodTypeRepository.existsById(id)) {
            throw new EntityNotFoundException("BloodType not found with id: " + id);
        }
        bloodTypeRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findUsersByBloodTypeId(Integer bloodTypeId) {
        if (!bloodTypeRepository.existsById(bloodTypeId)) {
            throw new EntityNotFoundException("BloodType not found with id: " + bloodTypeId);
        }
        List<User> users = userRepository.findByBloodTypeId(bloodTypeId);
        return users.stream()
                .map(userService::mapToUserResponse)
                .collect(Collectors.toList());
    }



    private BloodTypeResponse mapToBloodTypeResponse(BloodType bloodType) {
        if (bloodType == null) return null;
        BloodTypeResponse res = new BloodTypeResponse();
        BeanUtils.copyProperties(bloodType, res);
        return res;
    }
}