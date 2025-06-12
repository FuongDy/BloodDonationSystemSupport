package com.hicode.backend.service;

import com.hicode.backend.dto.admin.AppointmentResponse;
import com.hicode.backend.dto.admin.CreateAppointmentRequest;
import com.hicode.backend.model.entity.DonationAppointment;
import com.hicode.backend.model.entity.DonationProcess;
import com.hicode.backend.model.enums.DonationStatus;
import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.DonationAppointmentRepository;
import com.hicode.backend.repository.DonationProcessRepository;
import com.hicode.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService {

    @Autowired
    private DonationAppointmentRepository appointmentRepository;
    @Autowired
    private DonationProcessRepository processRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        DonationProcess process = processRepository.findById(request.getProcessId())
                .orElseThrow(() -> new EntityNotFoundException("Donation process not found with id: " + request.getProcessId()));

        if (process.getStatus() != DonationStatus.APPOINTMENT_PENDING) {
            throw new IllegalStateException("Cannot create appointment for a process that is not pending appointment.");
        }

        DonationAppointment appointment = new DonationAppointment();
        appointment.setDonationProcess(process);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setLocation(request.getLocation());
        appointment.setNotes(request.getNotes());

        if (request.getStaffId() != null) {
            User staff = userRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new EntityNotFoundException("Staff user not found with id: " + request.getStaffId()));
            appointment.setStaff(staff);
        }

        DonationAppointment savedAppointment = appointmentRepository.save(appointment);

        process.setDonationAppointment(savedAppointment);
        process.setStatus(DonationStatus.APPOINTMENT_SCHEDULED);
        process.setNote("Appointment scheduled for " + request.getAppointmentDateTime() + " at " + request.getLocation());
        processRepository.save(process);

        return mapToResponse(savedAppointment);
    }

    public AppointmentResponse mapToResponse(DonationAppointment entity) {
        if (entity == null) return null;
        AppointmentResponse response = new AppointmentResponse();
        BeanUtils.copyProperties(entity, response);

        if (entity.getDonationProcess() != null) {
            response.setProcessId(entity.getDonationProcess().getId());
            response.setDonor(userService.mapToUserResponse(entity.getDonationProcess().getDonor()));
        }
        if(entity.getStaff() != null) {
            response.setStaff(userService.mapToUserResponse(entity.getStaff()));
        }
        return response;
    }
}