package com.hicode.backend.service;

import com.hicode.backend.dto.admin.AppointmentResponse;
import com.hicode.backend.dto.admin.CreateAppointmentRequest;
import com.hicode.backend.dto.admin.RescheduleRequest;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

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
    @Autowired
    private EmailService emailService;

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        DonationProcess process = processRepository.findById(request.getProcessId())
                .orElseThrow(() -> new EntityNotFoundException("Donation process not found with id: " + request.getProcessId()));

        if (process.getStatus() != DonationStatus.APPOINTMENT_PENDING && process.getStatus() != DonationStatus.RESCHEDULE_REQUESTED) {
            throw new IllegalStateException("Cannot create appointment for this donation process state.");
        }

        DonationAppointment appointment = new DonationAppointment();
        appointment.setDonationProcess(process);
        appointment.setAppointmentDate(request.getAppointmentDate());
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

        String formattedDate = request.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        process.setNote("Lịch hẹn hiến máu đã tạo. Ngày: " + formattedDate + " at " + request.getLocation());
        processRepository.save(process);

        //GỬI EMAIL XÁC NHẬN LỊCH HẸN
        sendAppointmentConfirmationEmail(process.getDonor(), savedAppointment);
        // =============================================

        return mapToResponse(savedAppointment);
    }

    /**
     * PHƯƠNG THỨC MỚI: Soạn và gửi email xác nhận lịch hẹn cho người hiến máu.
     */
    private void sendAppointmentConfirmationEmail(User donor, DonationAppointment appointment) {
        String recipientEmail = donor.getEmail();
        String subject = "Xác nhận lịch hẹn hiến máu";
        String formattedDate = appointment.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        String emailBody = String.format(
                "Chào %s,\n\n" +
                        "Lịch hẹn hiến máu của bạn đã được xác nhận thành công.\n\n" +
                        "Thông tin chi tiết:\n" +
                        "- Ngày hẹn: %s\n" +
                        "- Địa điểm: %s\n\n" +
                        "Vui lòng có mặt đúng giờ và mang theo giấy tờ tùy thân. " +
                        "Chúng tôi rất trân trọng sự đóng góp của bạn.\n\n" +
                        "Trân trọng,\n" +
                        "Đội ngũ hỗ trợ hiến máu.",
                donor.getFullName(),
                formattedDate,
                appointment.getLocation()
        );

        emailService.sendEmail(recipientEmail, subject, emailBody);
    }


    @Transactional
    public void requestReschedule(Long appointmentId, RescheduleRequest request) {
        DonationAppointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

        DonationProcess process = appointment.getDonationProcess();
        process.setStatus(DonationStatus.RESCHEDULE_REQUESTED);
        process.setNote("Reschedule requested. Reason: " + request.getReason());

        appointmentRepository.delete(appointment);

        String emailSubject = "Thông báo: Yêu cầu đặt lại lịch hẹn hiến máu";
        String emailBody = String.format(
                "Chào %s,\n\nLịch hẹn hiến máu của bạn (ID quy trình: %d) cần được đặt lại vì lý do sau: %s\n\n" +
                        "Chúng tôi sẽ sớm liên hệ với bạn để sắp xếp một lịch hẹn mới phù hợp. Xin cảm ơn.\n",
                process.getDonor().getFullName(),
                process.getId(),
                request.getReason()
        );
        emailService.sendEmail(process.getDonor().getEmail(), emailSubject, emailBody);

        processRepository.save(process);
    }

    public AppointmentResponse mapToResponse(DonationAppointment entity) {
        if (entity == null) return null;

        AppointmentResponse response = new AppointmentResponse();
        BeanUtils.copyProperties(entity, response);

        if (entity.getDonationProcess() != null) {
            response.setProcessId(entity.getDonationProcess().getId());
            response.setDonor(userService.mapToUserResponse(entity.getDonationProcess().getDonor()));
            
            // Thêm thông tin về status và type từ donation process
            response.setStatus(entity.getDonationProcess().getStatus());
            response.setDonationType(entity.getDonationProcess().getDonationType());
            response.setProcessNote(entity.getDonationProcess().getNote());
            response.setCollectedVolumeMl(entity.getDonationProcess().getCollectedVolumeMl());
            response.setCreatedAt(entity.getDonationProcess().getCreatedAt());
            response.setUpdatedAt(entity.getDonationProcess().getUpdatedAt());
        }
        if(entity.getStaff() != null) {
            response.setStaff(userService.mapToUserResponse(entity.getStaff()));
        }
        return response;
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getMyAppointments() {
        User currentUser = userService.getCurrentUser();
        List<DonationAppointment> appointments = appointmentRepository.findByDonorId(currentUser.getId());
        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}