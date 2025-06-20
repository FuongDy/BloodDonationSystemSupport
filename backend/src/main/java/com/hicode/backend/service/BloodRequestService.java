package com.hicode.backend.service;

import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.dto.admin.BloodTypeResponse;
import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.BloodRequestRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.DonationPledgeRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {

    @Autowired private BloodRequestRepository bloodRequestRepository;
    @Autowired private BloodTypeRepository bloodTypeRepository;
    @Autowired private DonationPledgeRepository pledgeRepository;
    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;

    @Transactional
    public BloodRequestResponse createRequest(CreateBloodRequestRequest request) {
        User currentStaff = userService.getCurrentUser();
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found with id: " + request.getBloodTypeId()));

        BloodRequest newRequest = new BloodRequest();
        newRequest.setPatientName(request.getPatientName());
        newRequest.setHospital(request.getHospital());
        newRequest.setBloodType(bloodType);
        newRequest.setQuantityInUnits(request.getQuantityInUnits());
        newRequest.setUrgency(request.getUrgency());
        newRequest.setCreatedBy(currentStaff);

        BloodRequest savedRequest = bloodRequestRepository.save(newRequest);
        sendNotificationToAvailableDonors(savedRequest);

        return mapToResponse(savedRequest);
    }

    public List<BloodRequestResponse> searchActiveRequests() {
        List<BloodRequest> requests = bloodRequestRepository.findByStatusWithDetails(RequestStatus.PENDING);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public BloodRequestResponse getRequestById(Long id) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + id));
        return mapToResponse(request);
    }

    public Page<BloodRequestResponse> getAllRequests(Pageable pageable) {
        Page<BloodRequest> requestPage = bloodRequestRepository.findAll(pageable);
        return requestPage.map(this::mapToResponse);
    }

    @Transactional
    public DonationPledge pledgeForRequest(Long requestId) {
        User currentUser = userService.getCurrentUser();
        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found"));

        if(bloodRequest.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("This blood request is no longer active.");
        }

        boolean alreadyPledged = bloodRequest.getPledges().stream()
                .anyMatch(p -> p.getDonor().getId().equals(currentUser.getId()));
        if (alreadyPledged) {
            throw new IllegalStateException("You have already pledged for this blood request.");
        }

        DonationPledge pledge = new DonationPledge();
        pledge.setDonor(currentUser);
        pledge.setBloodRequest(bloodRequest);

        DonationPledge savedPledge = pledgeRepository.save(pledge);
        checkAndUpdateRequestStatus(bloodRequest);
        return savedPledge;
    }

    private void checkAndUpdateRequestStatus(BloodRequest bloodRequest) {
        BloodRequest updatedRequest = bloodRequestRepository.findById(bloodRequest.getId()).get();
        int requiredQuantity = updatedRequest.getQuantityInUnits();
        int currentPledges = updatedRequest.getPledges().size();
        if (currentPledges >= requiredQuantity) {
            updatedRequest.setStatus(RequestStatus.FULFILLED);
            bloodRequestRepository.save(updatedRequest);
        }
    }

    @Async
    public void sendNotificationToAvailableDonors(BloodRequest bloodRequest) {
        // ...
    }

    private BloodRequestResponse mapToResponse(BloodRequest entity) {
        BloodRequestResponse response = new BloodRequestResponse();
        BeanUtils.copyProperties(entity, response, "bloodType", "createdBy", "pledges");

        if (entity.getBloodType() != null) {
            BloodTypeResponse btResponse = new BloodTypeResponse();
            BeanUtils.copyProperties(entity.getBloodType(), btResponse);
            response.setBloodType(btResponse);
        }

        if (entity.getCreatedBy() != null) {
            response.setCreatedBy(userService.mapToUserResponse(entity.getCreatedBy()));
        }

        if (entity.getPledges() != null) {
            response.setPledgeCount(entity.getPledges().size());
        } else {
            response.setPledgeCount(0);
        }
        return response;
    }
}