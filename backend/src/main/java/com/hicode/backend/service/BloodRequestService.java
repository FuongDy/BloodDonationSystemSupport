package com.hicode.backend.service;

import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.BloodRequestRepository;
import com.hicode.backend.repository.BloodTypeRepository;
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
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    // Giả sử bạn có một EmailService để gửi thông báo
    // @Autowired
    // private EmailService emailService;

    @Transactional
    public BloodRequest createRequest(CreateBloodRequestRequest request) {
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
        newRequest.setStatus(RequestStatus.PENDING);

        BloodRequest savedRequest = bloodRequestRepository.save(newRequest);

        // Kích hoạt gửi thông báo bất đồng bộ
        // sendNotificationToAvailableDonors(savedRequest);

        return savedRequest;
    }

    public Page<BloodRequest> getAllRequests(Pageable pageable) {
        return bloodRequestRepository.findAll(pageable);
    }

    @Transactional
    public BloodRequest updateStatus(Long requestId, RequestStatus newStatus) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + requestId));
        request.setStatus(newStatus);
        return bloodRequestRepository.save(request);
    }


    @Async
    public void sendNotificationToAvailableDonors(BloodRequest bloodRequest) {
        // Tạm thời comment out logic này, bạn có thể hoàn thiện sau khi có EmailService
        List<User> availableDonors = userRepository.findByIsReadyToDonateFalseAndLastDonationDateIsNotNull();

        String subject = "[Thông báo khẩn] Kêu gọi hiến máu nhóm " + bloodRequest.getBloodType().getBloodGroup();
        String text = String.format(
            "Chào bạn,\n\nHệ thống đang có một trường hợp khẩn cấp cần máu nhóm %s tại %s cho bệnh nhân %s...",
            bloodRequest.getBloodType().getBloodGroup(),
            bloodRequest.getHospital(),
            bloodRequest.getPatientName()
        );

        for (User donor : availableDonors) {
            // emailService.sendEmail(donor.getEmail(), subject, text);
        }
    }

}