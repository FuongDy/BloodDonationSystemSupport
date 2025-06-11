package com.hicode.backend.service;

import com.hicode.backend.dto.admin.BloodTestResultRequest;
import com.hicode.backend.dto.DonationProcessResponse;
import com.hicode.backend.dto.admin.HealthCheckRequest;
import com.hicode.backend.dto.admin.UpdateDonationStatusRequest;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.DonationStatus;
import com.hicode.backend.model.entity.HealthCheck;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.DonationProcessRepository;
import com.hicode.backend.repository.HealthCheckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired
    private DonationProcessRepository donationProcessRepository;
    @Autowired
    private HealthCheckRepository healthCheckRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private AppointmentService appointmentService;

    // User đăng ký hiến máu
    @Transactional
    public DonationProcessResponse createDonationRequest() {
        User currentUser = userService.getCurrentUser();
        DonationProcess process = new DonationProcess();
        process.setDonor(currentUser);
        process.setStatus(DonationStatus.PENDING_APPROVAL);
        DonationProcess savedProcess = donationProcessRepository.save(process);
        return mapToResponse(savedProcess);
    }

    @Transactional(readOnly = true)
    public List<DonationProcessResponse> getMyDonationHistory() {
        User currentUser = userService.getCurrentUser();
        List<DonationProcess> processes = donationProcessRepository.findByDonorIdWithAppointment(currentUser.getId());
        return processes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DonationProcessResponse> getAllDonationRequests() {
        List<DonationProcess> processes = donationProcessRepository.findAllWithAppointment();
        return processes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Staff/Admin duyệt/từ chối đơn
    @Transactional
    public DonationProcessResponse updateDonationStatus(Long processId, UpdateDonationStatusRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("This request is not pending approval.");
        }
        if (request.getNewStatus() == DonationStatus.REJECTED || request.getNewStatus() == DonationStatus.APPOINTMENT_PENDING) {
            process.setStatus(request.getNewStatus());
            process.setNote(request.getNote());
        } else {
            throw new IllegalArgumentException("Invalid status. Only REJECTED or APPOINTMENT_PENDING are allowed.");
        }
        return mapToResponse(donationProcessRepository.save(process));
    }

    // --- CÁC PHƯƠNG THỨC MỚI ---

    // 1. Ghi nhận kết quả khám sàng lọc
    @Transactional
    public DonationProcessResponse recordHealthCheck(Long processId, HealthCheckRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.APPOINTMENT_SCHEDULED) {
            throw new IllegalStateException("Cannot record health check for a process that is not in scheduled state.");
        }
        HealthCheck healthCheck = new HealthCheck();
        BeanUtils.copyProperties(request, healthCheck);
        healthCheck.setDonationProcess(process);
        healthCheckRepository.save(healthCheck);

        process.setStatus(request.getIsEligible() ? DonationStatus.HEALTH_CHECK_PASSED : DonationStatus.HEALTH_CHECK_FAILED);
        process.setNote("Health check recorded. Result: " + (request.getIsEligible() ? "Passed." : "Failed."));
        return mapToResponse(donationProcessRepository.save(process));
    }

    // 2. Xác nhận đã lấy máu
    @Transactional
    public DonationProcessResponse markBloodAsCollected(Long processId) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.HEALTH_CHECK_PASSED) {
            throw new IllegalStateException("Blood can only be collected after a passed health check.");
        }
        process.setStatus(DonationStatus.BLOOD_COLLECTED);
        process.setNote("Blood collected successfully. Awaiting test results.");
        return mapToResponse(donationProcessRepository.save(process));
    }

    // 3. Ghi nhận kết quả xét nghiệm máu
    @Transactional
    public DonationProcessResponse recordBloodTestResult(Long processId, BloodTestResultRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.BLOOD_COLLECTED) {
            throw new IllegalStateException("Cannot record test results for blood that has not been collected.");
        }

        // Ở đây bạn có thể tạo và lưu một Entity BloodTestResult nếu muốn
        // Ví dụ: BloodTestResult testResult = new BloodTestResult(); ... testResultRepository.save(testResult);

        if (request.getIsSafe()) {
            process.setStatus(DonationStatus.COMPLETED);
            process.setNote("Blood unit " + request.getBloodUnitId() + " passed all tests. Process completed.");
        } else {
            process.setStatus(DonationStatus.TESTING_FAILED);
            process.setNote("Blood unit " + request.getBloodUnitId() + " failed testing. Reason: " + request.getNotes());
        }
        return mapToResponse(donationProcessRepository.save(process));
    }

    // --- HÀM HELPER ---
    private DonationProcess findProcessById(Long processId) {
        return donationProcessRepository.findById(processId)
                .orElseThrow(() -> new EntityNotFoundException("Donation process not found with id: " + processId));
    }

    private DonationProcessResponse mapToResponse(DonationProcess entity) {
        DonationProcessResponse response = new DonationProcessResponse();
        BeanUtils.copyProperties(entity, response, "donor", "donationAppointment");

        if (entity.getDonor() != null) {
            response.setDonor(userService.mapToUserResponse(entity.getDonor()));
        }

        if (entity.getDonationAppointment() != null) {
            response.setAppointment(appointmentService.mapToResponse(entity.getDonationAppointment()));
        }

        return response;
    }
}