package com.hicode.backend.service;

import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.BloodRequestRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.DonationPledgeRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;
    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private DonationPledgeRepository pledgeRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;


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
        newRequest.setStatus(RequestStatus.PENDING);

        BloodRequest savedRequest = bloodRequestRepository.save(newRequest);
        sendNotificationToAvailableDonors(savedRequest);
        return savedRequest;
    }

    // --- CÁC PHƯƠNG THỨC MỚI ---

    public List<BloodRequest> searchActiveRequests() {
        return bloodRequestRepository.findByStatusWithDetails(RequestStatus.PENDING);
    }

    public BloodRequest getRequestById(Long id) {
        return bloodRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + id));
    }

    @Transactional
    public com.hicode.backend.entity.DonationPledge pledgeForRequest(Long requestId) {
        User currentUser = userService.getCurrentUser();
        BloodRequest bloodRequest = getRequestById(requestId);

        com.hicode.backend.entity.DonationPledge pledge = new com.hicode.backend.entity.DonationPledge();
        pledge.setDonor(currentUser);
        pledge.setBloodRequest(bloodRequest);

        return pledgeRepository.save(pledge);
    }

    // ----------------------------

    public Page<BloodRequest> getAllRequests(Pageable pageable) {
        return bloodRequestRepository.findAll(pageable);
    }

    @Transactional
    public BloodRequest updateStatus(Long requestId, RequestStatus newStatus) {
        BloodRequest request = getRequestById(requestId);
        request.setStatus(newStatus);
        return bloodRequestRepository.save(request);
    }

    @Async
    public void sendNotificationToAvailableDonors(BloodRequest bloodRequest) {
        List<User> availableDonors = userRepository.findByIsReadyToDonateFalseAndLastDonationDateIsNotNull();

        String subject = "[Thông báo khẩn] Kêu gọi hiến máu nhóm " + bloodRequest.getBloodType().getBloodGroup();
        String text = String.format(
                "Chào bạn,\n\nHệ thống đang có một trường hợp khẩn cấp cần máu nhóm %s tại %s cho bệnh nhân %s...",
                bloodRequest.getBloodType().getBloodGroup(),
                bloodRequest.getHospital(),
                bloodRequest.getPatientName()
        );

        for (User donor : availableDonors) {
            emailService.sendEmail(donor.getEmail(), subject, text);
        }
    }
}