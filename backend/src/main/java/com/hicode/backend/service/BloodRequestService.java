package com.hicode.backend.service;

import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.dto.admin.BloodTypeResponse;
import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.*; // THÊM IMPORT
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
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

    @Autowired private DonationProcessRepository donationProcessRepository;


    @Transactional
    public BloodRequestResponse createRequest(CreateBloodRequestRequest request) {
        checkBedAvailability(request.getRoomNumber(), request.getBedNumber());

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
        newRequest.setRoomNumber(request.getRoomNumber());
        newRequest.setBedNumber(request.getBedNumber());

        BloodRequest savedRequest = bloodRequestRepository.save(newRequest);
        sendNotificationToAvailableDonors(savedRequest);

        return mapToResponse(savedRequest);
    }

    private void checkBedAvailability(Integer roomNumber, Integer bedNumber) {
        boolean isOccupied = bloodRequestRepository.existsByRoomNumberAndBedNumberAndStatus(
                roomNumber, bedNumber, RequestStatus.PENDING
        );
        if (isOccupied) {
            throw new IllegalStateException(
                    String.format("Bed %d in Room %d is already occupied.", bedNumber, roomNumber)
            );
        }
    }

    @Transactional
    public DonationPledge pledgeForRequest(Long requestId) {
        User currentUser = userService.getCurrentUser();
        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found"));

        if(bloodRequest.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("This blood request is no longer active for pledging.");
        }

        boolean alreadyPledged = pledgeRepository.existsByDonorIdAndBloodRequestId(currentUser.getId(), requestId);
        if (alreadyPledged) {
            throw new IllegalStateException("You have already pledged for this blood request.");
        }

        // === LOGIC MỚI: TỰ ĐỘNG TẠO QUY TRÌNH HIẾN MÁU KHẨN CẤP ===
        createEmergencyDonationProcess(currentUser, bloodRequest);
        // ==========================================================

        DonationPledge pledge = new DonationPledge();
        pledge.setDonor(currentUser);
        pledge.setBloodRequest(bloodRequest);

        return pledgeRepository.save(pledge);
    }

    /**
     * PHƯƠNG THỨC HELPER MỚI: Tạo một quy trình hiến máu loại EMERGENCY
     */
    private void createEmergencyDonationProcess(User donor, BloodRequest forRequest) {
        DonationProcess process = new DonationProcess();
        process.setDonor(donor);

        DonationAppointment donationAppointment = new DonationAppointment();
        donationAppointment.setDonationProcess(process);
        donationAppointment.setAppointmentDate(LocalDate.now());

        process.setDonationAppointment(donationAppointment);
        donationAppointment.setLocation(forRequest.getHospital());
        process.setStatus(DonationStatus.APPOINTMENT_SCHEDULED); // Chuyển sang chờ kiểm tra sức khỏe.
        process.setDonationType(DonationType.EMERGENCY); // Gán đúng loại là KHẨN CẤP
        process.setNote("Donor pledged for emergency request ID: " + forRequest.getId() + " for patient " + forRequest.getPatientName());

        donationProcessRepository.save(process);
    }

    // ... các phương thức còn lại không thay đổi ...
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> searchActiveRequests() {
        List<BloodRequest> requests = bloodRequestRepository.findByStatusWithDetails(RequestStatus.PENDING);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BloodRequestResponse getRequestById(Long id) {
        BloodRequest request = bloodRequestRepository.findByIdWithPledges(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + id));
        return mapToResponse(request);
    }

    @Transactional(readOnly = true)
    public Page<BloodRequestResponse> getAllRequests(Pageable pageable) {
        Page<BloodRequest> requestPage = bloodRequestRepository.findAll(pageable);
        return requestPage.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<BloodRequestResponse> getCompletedRequests(Pageable pageable) {
        Page<BloodRequest> requestPage = bloodRequestRepository.findByStatus(RequestStatus.FULFILLED, pageable);
        return requestPage.map(this::mapToResponse);
    }

    @Transactional
    public BloodRequestResponse updateStatus(Long requestId, RequestStatus newStatus) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + requestId));
        request.setStatus(newStatus);
        return mapToResponse(bloodRequestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getPledgedUsersForRequest(Long requestId) {
        BloodRequest request = bloodRequestRepository.findByIdWithPledges(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + requestId));

        if (request.getPledges() == null) {
            return Collections.emptyList();
        }

        return request.getPledges().stream()
                .map(DonationPledge::getDonor)
                .map(userService::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Async
    public void sendNotificationToAvailableDonors(BloodRequest bloodRequest) {
        List<User> availableDonors = userRepository.findByIsReadyToDonateFalseAndLastDonationDateIsNotNull();

        String subject = "[Khẩn cấp] Kêu gọi hiến máu nhóm " + bloodRequest.getBloodType().getBloodGroup();
        String text = String.format(
                "Chào bạn,\n\nHệ thống hiến máu đang có một trường hợp khẩn cấp cần máu nhóm %s tại %s cho bệnh nhân %s.\n" +
                        "Số lượng cần: %d đơn vị.\n\n" +
                        "Vui lòng truy cập ứng dụng để xem chi tiết và đăng ký hỗ trợ nếu bạn đủ điều kiện.\n\n" +
                        "Trân trọng.",
                bloodRequest.getBloodType().getBloodGroup(),
                bloodRequest.getHospital(),
                bloodRequest.getPatientName(),
                bloodRequest.getQuantityInUnits()
        );

        for (User donor : availableDonors) {
            emailService.sendEmail(donor.getEmail(), subject, text);
        }
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