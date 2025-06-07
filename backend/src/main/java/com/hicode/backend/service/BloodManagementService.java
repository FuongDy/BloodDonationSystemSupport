package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.entity.BloodComponentType;
import com.hicode.backend.entity.BloodType;
import com.hicode.backend.entity.BloodTypeCompatibility;

import com.hicode.backend.repository.BloodTypeCompatibilityRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodManagementService {

    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private BloodTypeCompatibilityRepository bloodCompatibilityRepository;

    private BloodTypeResponse mapToBloodTypeResponse(BloodType bloodType) {
        if (bloodType == null) return null;
        BloodTypeResponse res = new BloodTypeResponse();
        BeanUtils.copyProperties(bloodType, res);
        return res;
    }

    private BloodCompatibilityDetailResponse mapToBloodCompatibilityDetailResponse(BloodTypeCompatibility rule) {
        if (rule == null) return null;
        BloodCompatibilityDetailResponse res = new BloodCompatibilityDetailResponse();
        BeanUtils.copyProperties(rule, res, "donorBloodType", "recipientBloodType");

        BloodType donorBloodTypeEntity = rule.getDonorBloodType();
        BloodType recipientBloodTypeEntity = rule.getRecipientBloodType();

        res.setDonorBloodType(mapToBloodTypeResponse(donorBloodTypeEntity));
        res.setRecipientBloodType(mapToBloodTypeResponse(recipientBloodTypeEntity));
        return res;
    }

    public List<BloodTypeResponse> getAllBloodTypes() {
        return bloodTypeRepository.findAllByActiveTrue().stream()
                .map(this::mapToBloodTypeResponse)
                .collect(Collectors.toList());
    }

    public BloodTypeResponse getBloodTypeDetails(Integer id) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BloodType not found with id: " + id));
        return mapToBloodTypeResponse(bloodType);
    }

    @Transactional
    public BloodTypeResponse createBloodType(CreateBloodTypeRequest request) {
        Optional<BloodType> existingBloodTypeOpt = bloodTypeRepository.findByBloodGroupAndComponentType(
                request.getBloodGroup(), request.getComponentType());

        BloodType bloodType;
        if (existingBloodTypeOpt.isPresent()) {
            // Đã tìm thấy bản ghi, kiểm tra xem nó có active không
            bloodType = existingBloodTypeOpt.get();

            if (bloodType.getActive()) {
                // Nếu đang active, thì đây mới thực sự là lỗi trùng lặp
                throw new IllegalArgumentException("Blood type with group '" + request.getBloodGroup() +
                        "' and component '" + request.getComponentType().name() + "' already exists and is active.");
            } else {
                // Nếu không active (đã bị xóa mềm), hãy "hồi sinh" và cập nhật nó
                bloodType.setActive(true);
                // Cập nhật các trường khác từ request
                bloodType.setDescription(request.getDescription());
                bloodType.setShelfLifeDays(request.getShelfLifeDays());
                bloodType.setStorageTempMin(request.getStorageTempMin());
                bloodType.setStorageTempMax(request.getStorageTempMax());
                bloodType.setVolumeMl(request.getVolumeMl());
            }
        } else {
            // Nếu không tìm thấy bản ghi nào, hãy tạo mới hoàn toàn
            bloodType = new BloodType();
            bloodType.setBloodGroup(request.getBloodGroup());
            bloodType.setComponentType(request.getComponentType());
            bloodType.setDescription(request.getDescription());
            bloodType.setShelfLifeDays(request.getShelfLifeDays());
            bloodType.setStorageTempMin(request.getStorageTempMin());
            bloodType.setStorageTempMax(request.getStorageTempMax());
            bloodType.setVolumeMl(request.getVolumeMl());
        }

        BloodType savedBloodType = bloodTypeRepository.save(bloodType);
        return mapToBloodTypeResponse(savedBloodType);
    }

    @Transactional
    public BloodTypeResponse updateBloodType(Integer id, UpdateBloodTypeRequest request) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BloodType not found with id: " + id));

        if (request.getDescription() != null) {
            bloodType.setDescription(request.getDescription());
        }

        return mapToBloodTypeResponse(bloodTypeRepository.save(bloodType));
    }

    @Transactional
    public BloodTypeResponse softDeleteBloodType(Integer id) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BloodType not found with id: " + id));
        bloodType.setActive(false);
        BloodType updatedBloodType = bloodTypeRepository.save(bloodType);
        return mapToBloodTypeResponse(updatedBloodType);
    }

    public Page<BloodCompatibilityDetailResponse> searchCompatibilityRules(Integer donorTypeId, Integer recipientTypeId, Pageable pageable) {
        Specification<BloodTypeCompatibility> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.isTrue(root.get("active")));

            if (donorTypeId != null) {
                predicates.add(criteriaBuilder.equal(root.get("donorBloodType").get("id"), donorTypeId));
            }

            if (recipientTypeId != null) {
                predicates.add(criteriaBuilder.equal(root.get("recipientBloodType").get("id"), recipientTypeId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return bloodCompatibilityRepository.findAll(spec, pageable).map(this::mapToBloodCompatibilityDetailResponse);
    }

    public BloodCompatibilityDetailResponse getCompatibilityRuleDetails(Integer id) {
        BloodTypeCompatibility rule = bloodCompatibilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compatibility rule not found with id: " + id));
        return mapToBloodCompatibilityDetailResponse(rule);
    }

    @Transactional
    public BloodCompatibilityDetailResponse createCompatibilityRule(CreateBloodCompatibilityRequest request) {
        BloodType donor = bloodTypeRepository.findById(request.getDonorBloodTypeId())
                .orElseThrow(() -> new RuntimeException("Donor BloodType ID " + request.getDonorBloodTypeId() + " not found."));
        BloodType recipient = bloodTypeRepository.findById(request.getRecipientBloodTypeId())
                .orElseThrow(() -> new RuntimeException("Recipient BloodType ID " + request.getRecipientBloodTypeId() + " not found."));

        bloodCompatibilityRepository.findByDonorBloodTypeIdAndRecipientBloodTypeId(
                        request.getDonorBloodTypeId(), request.getRecipientBloodTypeId())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("This specific compatibility rule (donor-recipient) already exists.");
                });

        BloodTypeCompatibility rule = new BloodTypeCompatibility();
        rule.setDonorBloodType(donor);
        rule.setRecipientBloodType(recipient);
        rule.setIsCompatible(request.getIsCompatible());
        rule.setCompatibilityScore(request.getCompatibilityScore() != null ? request.getCompatibilityScore() : 100);
        rule.setIsEmergencyCompatible(request.getIsEmergencyCompatible() != null ? request.getIsEmergencyCompatible() : false);
        rule.setNotes(request.getNotes());
        return mapToBloodCompatibilityDetailResponse(bloodCompatibilityRepository.save(rule));
    }

    @Transactional
    public BloodCompatibilityDetailResponse updateCompatibilityRule(Integer id, UpdateBloodCompatibilityRequest request) {
        BloodTypeCompatibility rule = bloodCompatibilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compatibility rule not found with id: " + id));

        if (request.getDonorBloodTypeId() != null) {
            BloodType donor = bloodTypeRepository.findById(request.getDonorBloodTypeId())
                    .orElseThrow(() -> new RuntimeException("Donor BloodType ID " + request.getDonorBloodTypeId() + " not found."));
            rule.setDonorBloodType(donor);
        }
        if (request.getRecipientBloodTypeId() != null) {
            BloodType recipient = bloodTypeRepository.findById(request.getRecipientBloodTypeId())
                    .orElseThrow(() -> new RuntimeException("Recipient BloodType ID " + request.getRecipientBloodTypeId() + " not found."));
            rule.setRecipientBloodType(recipient);
        }

        if (request.getIsCompatible() != null) rule.setIsCompatible(request.getIsCompatible());
        if (request.getCompatibilityScore() != null) rule.setCompatibilityScore(request.getCompatibilityScore());
        if (request.getIsEmergencyCompatible() != null) rule.setIsEmergencyCompatible(request.getIsEmergencyCompatible());
        if (request.getNotes() != null) rule.setNotes(request.getNotes());

        return mapToBloodCompatibilityDetailResponse(bloodCompatibilityRepository.save(rule));
    }

    @Transactional
    public BloodCompatibilityDetailResponse softDeleteCompatibilityRule(Integer id) {
        BloodTypeCompatibility rule = bloodCompatibilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compatibility rule not found with id: " + id));
        rule.setActive(false);
        BloodTypeCompatibility updatedRule = bloodCompatibilityRepository.save(rule);
        return mapToBloodCompatibilityDetailResponse(updatedRule);
    }

    public Page<BloodTypeResponse> searchBloodTypes(String bloodGroup, BloodComponentType componentType, Pageable pageable) {
        Specification<BloodType> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.isTrue(root.get("active")));

            if (bloodGroup != null && !bloodGroup.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("bloodGroup")),
                        bloodGroup.trim().toLowerCase()
                ));
            }

            if (componentType != null) {
                predicates.add(criteriaBuilder.equal(root.get("componentType"), componentType));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return bloodTypeRepository.findAll(spec, pageable).map(this::mapToBloodTypeResponse);
    }
}