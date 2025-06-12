package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.dto.admin.*;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
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
    @Autowired
    private InventoryService inventoryService;

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

    @Transactional
    public DonationProcessResponse markBloodAsCollected(Long processId, CollectionInfoRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.HEALTH_CHECK_PASSED) {
            throw new IllegalStateException("Blood can only be collected after a passed health check.");
        }
        process.setCollectedVolumeMl(request.getCollectedVolumeMl());
        process.setStatus(DonationStatus.BLOOD_COLLECTED);
        process.setNote("Blood collected ("+ request.getCollectedVolumeMl() +"ml). Awaiting test results.");
        return mapToResponse(donationProcessRepository.save(process));
    }

    @Transactional
    public DonationProcessResponse recordBloodTestResult(Long processId, BloodTestResultRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.BLOOD_COLLECTED) {
            throw new IllegalStateException("Cannot record test results for blood that has not been collected.");
        }

        if (request.getIsSafe()) {
            inventoryService.addUnitToInventory(process, request.getBloodUnitId());
            process.setStatus(DonationStatus.COMPLETED);
            process.setNote("Blood unit " + request.getBloodUnitId() + " passed tests and added to inventory.");
        } else {
            process.setStatus(DonationStatus.TESTING_FAILED);
            process.setNote("Blood unit " + request.getBloodUnitId() + " failed testing. Reason: " + request.getNotes());
        }
        return mapToResponse(donationProcessRepository.save(process));
    }

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