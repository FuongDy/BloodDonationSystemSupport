package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.dto.admin.HealthCheckRequest;
import com.hicode.backend.dto.admin.BloodTestResultRequest;
import com.hicode.backend.dto.admin.CollectionInfoRequest;
import com.hicode.backend.dto.admin.DonationProcessResponse;
import com.hicode.backend.dto.admin.UpdateDonationStatusRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DonationService {

    @Autowired private DonationProcessRepository donationProcessRepository;
    @Autowired private HealthCheckRepository healthCheckRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BloodTypeRepository bloodTypeRepository;
    @Autowired private UserService userService;
    @Autowired private AppointmentService appointmentService;
    @Autowired private InventoryService inventoryService;
    @Autowired private EmailService emailService;
    @Autowired private PdfService pdfService;
    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private DonationAppointmentRepository appointmentRepository;



    /**
     * User đăng ký một quy trình hiến máu mới.
     */
    @Transactional
    public DonationProcessResponse createDonationRequest() {
        User currentUser = userService.getCurrentUser();
        if (Boolean.FALSE.equals(currentUser.getIsReadyToDonate())) {
            throw new IllegalStateException("Bạn chưa đủ điều kiện để tham gia hiến máu khẩn cấp.");
        }
        DonationProcess process = new DonationProcess();
        process.setDonor(currentUser);
        process.setStatus(DonationStatus.PENDING_APPROVAL);
        process.setDonationType(DonationType.STANDARD);
        DonationProcess savedProcess = donationProcessRepository.save(process);
        return mapToResponse(savedProcess);
    }

    /**
     * User xem lịch sử các lần đăng ký hiến máu của mình.
     */
    @Transactional(readOnly = true)
    public List<DonationProcessResponse> getMyDonationHistory() {
        User currentUser = userService.getCurrentUser();
        List<DonationProcess> processes = donationProcessRepository.findByDonorIdWithDetails(currentUser.getId());
        return processes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Staff/Admin xem tất cả các đơn đăng ký hiến máu.
     */
    @Transactional(readOnly = true)
    public List<DonationProcessResponse> getAllDonationRequests() {
        List<DonationProcess> processes = donationProcessRepository.findAllWithDetails();
        return processes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Staff/Admin duyệt hoặc từ chối một đơn đăng ký.
     */
    @Transactional
    public DonationProcessResponse updateDonationStatus(Long processId, UpdateDonationStatusRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("This request is not pending approval.");
        }
        if(process.getDonationType() == DonationType.EMERGENCY && request.getNewStatus() == DonationStatus.APPOINTMENT_PENDING){
            process.setStatus(DonationStatus.APPOINTMENT_SCHEDULED);
            process.setNote("Emmergency donation approved. Auto-creating appointment for this case and immediate move to health check");

            DonationAppointment appointment = new DonationAppointment();
            appointment.setDonationProcess(process);
            appointment.setAppointmentDate(LocalDate.now());
            appointment.setLocation("Bệnh viện Huyết học - FPT");
            appointmentRepository.save(appointment);
            appointment.setNotes("Auto schedule generation for Emergency donation process");
            donationProcessRepository.save(process);
        } else if (request.getNewStatus() == DonationStatus.REJECTED || request.getNewStatus() == DonationStatus.APPOINTMENT_PENDING) {
            process.setStatus(request.getNewStatus());
            process.setNote(request.getNote());
        } else {
            throw new IllegalArgumentException("Invalid status. Only REJECTED or APPOINTMENT_PENDING are allowed from this state.");
        }
        return mapToResponse(donationProcessRepository.save(process));
    }

    /**
     * Staff/Admin ghi nhận kết quả khám sàng lọc.
     */
    @Transactional
    public DonationProcessResponse recordHealthCheck(Long processId, HealthCheckRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.APPOINTMENT_SCHEDULED) {
            throw new IllegalStateException("Cannot record health check for a process that is not in a scheduled state.");
        }

        HealthCheck healthCheck = process.getHealthCheck() != null ? process.getHealthCheck() : new HealthCheck();

        BeanUtils.copyProperties(request, healthCheck);
        healthCheck.setDonationProcess(process);
        healthCheckRepository.save(healthCheck);

        process.setHealthCheck(healthCheck);
        process.setStatus(request.getIsEligible() ? DonationStatus.HEALTH_CHECK_PASSED : DonationStatus.HEALTH_CHECK_FAILED);
        process.setNote("Health check recorded. Result: " + (request.getIsEligible() ? "Passed." : "Failed. " + request.getNotes()));

        DonationProcess updatedProcess = donationProcessRepository.save(process);
        return mapToResponse(updatedProcess);
    }

    /**
     * Staff/Admin xác nhận đã lấy máu và ghi nhận thể tích.
     */
    @Transactional
    public DonationProcessResponse markBloodAsCollected(Long processId, CollectionInfoRequest request) {
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.HEALTH_CHECK_PASSED) {
            throw new IllegalStateException("Blood can only be collected after a passed health check.");
        }
        process.setCollectedVolumeMl(request.getCollectedVolumeMl());
        process.setStatus(DonationStatus.BLOOD_COLLECTED);

        User donor = process.getDonor();
        donor.setIsReadyToDonate(false);
        donor.setLastDonationDate(LocalDate.now());
        userRepository.save(donor);

        process.setNote("Blood collected ("+ request.getCollectedVolumeMl() +"ml). Awaiting test results.");
        return mapToResponse(donationProcessRepository.save(process));
    }


    /**
     * Staff/Admin ghi nhận kết quả xét nghiệm túi máu.
     * <<< LOGIC MỚI ĐÃ ĐƯỢC THÊM VÀO ĐÂY >>>
     */
    @Transactional
    public DonationProcessResponse recordBloodTestResult(Long processId, BloodTestResultRequest request) {
        log.info("Recording blood test result for process ID: {}", processId);
        DonationProcess process = findProcessById(processId);
        if (process.getStatus() != DonationStatus.BLOOD_COLLECTED) {
            log.warn("Attempted to record test results for a process not in BLOOD_COLLECTED state. Status is: {}", process.getStatus());
            throw new IllegalStateException("Cannot record test results for blood that has not been collected.");
        }

        User donor = process.getDonor();

        if (request.getBloodTypeId() != null) {
            log.info("Updating blood type for donor ID: {}", donor.getId());
            BloodType newBloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                    .orElseThrow(() -> new EntityNotFoundException("BloodType not found with id: " + request.getBloodTypeId()));
            donor.setBloodType(newBloodType);
            userRepository.save(donor);
        }

        log.info("Checking blood test safety. isSafe = {}", request.getIsSafe());
        if (request.getIsSafe()) {
            inventoryService.addUnitToInventory(process, request.getBloodUnitId());
            process.setStatus(DonationStatus.COMPLETED);
            process.setNote("Đơn vị máu ID: " + request.getBloodUnitId() + " đã vượt qua kiểm tra và được thêm vào kho.");

            byte[] pdfBytes = null;
            try {
                log.info("Starting certificate generation for process ID: {}", processId);
                pdfBytes = pdfService.generateCertificatePdf(process);
                log.info("PDF generated successfully. Starting upload to Cloudinary...");

                String certificateUrl = cloudinaryService.upload(pdfBytes, "certificates");
                log.info("Certificate uploaded successfully. URL: {}", certificateUrl);
                process.setCertificateUrl(certificateUrl); // Lưu link vào DB để quản lý

            } catch (Exception e) {
                log.error("!!! CRITICAL: Certificate generation or upload FAILED for process ID: {}", processId, e);
                process.setNote(process.getNote() + " | CRITICAL: Certificate generation/upload failed. Check logs for details.");
            }

            // Gửi email
            if (pdfBytes != null) {
                // Nếu tạo PDF thành công, gửi email có đính kèm file
                sendTestResultEmailWithAttachment(process, request, pdfBytes);
            } else {
                // Nếu tạo PDF thất bại, gửi email thông báo kết quả nhưng không có chứng nhận
                sendTestResultEmail(process, request);
            }

        } else {
            process.setStatus(DonationStatus.TESTING_FAILED);
            process.setNote("Blood unit " + request.getBloodUnitId() + " failed testing. Reason: " + request.getNotes());
            log.info("Preparing to send 'UNSAFE' test result email to {}", donor.getEmail());
            sendTestResultEmail(process, request);
        }

        DonationProcess savedProcess = donationProcessRepository.save(process);
        log.info("Successfully saved final process state for ID: {}. Status: {}", savedProcess.getId(), savedProcess.getStatus());
        return mapToResponse(savedProcess);
    }


    // ... (các phương thức helper còn lại không thay đổi) ...
    /**
     * Soạn và gửi email có đính kèm file chứng nhận.
     */
    private void sendTestResultEmailWithAttachment(DonationProcess process, BloodTestResultRequest result, byte[] certificatePdf) {
        User donor = process.getDonor();
        DonationAppointment appointment = process.getDonationAppointment();

        String recipientEmail = donor.getEmail();
        String subject = "Kết quả xét nghiệm máu và Giấy chứng nhận hiến máu";
        String donationDate = appointment.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String location = appointment.getLocation();
        String bloodGroup = donor.getBloodType() != null ? donor.getBloodType().getBloodGroup() : "chưa xác định";
        String resultText = "KQ: Nhóm máu " + bloodGroup + ", âm tính với VR HIV, VR viêm gan B, VR viêm gan C, VK giang mai.";

        String emailBody = String.format(
                "Trân trọng cảm ơn Anh/Chị %s đã tham gia Hiến máu vào ngày %s tại %s.\n\n" +
                        "Chúng tôi xin gửi kết quả xét nghiệm máu của Anh/Chị:\n%s\n\n" +
                        "Giấy chứng nhận hiến máu của Anh/Chị đã được đính kèm trong email này.\n\n" +
                        "Kính mong Anh/Chị sẽ tiếp tục tham gia Hiến máu trong các chương trình tiếp theo. LH: 0338203440",
                donor.getFullName(), donationDate, location, resultText
        );

        String attachmentName = "Chung-Nhan-Hien-Mau-" + donor.getFullName().replaceAll("\\s+", "") + ".pdf";

        try {
            emailService.sendEmailWithAttachment(recipientEmail, subject, emailBody, certificatePdf, attachmentName);
            log.info("Successfully sent email with certificate attachment to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send email with attachment to {}", recipientEmail, e);
        }
    }

    /**
     * Gửi email thông báo kết quả xét nghiệm (không có file đính kèm).
     * Dùng cho trường hợp hiến máu không thành công hoặc khi tạo PDF bị lỗi.
     */
    private void sendTestResultEmail(DonationProcess process, BloodTestResultRequest result) {
        User donor = process.getDonor();
        DonationAppointment appointment = process.getDonationAppointment();

        String recipientEmail = donor.getEmail();
        String subject = "Kết quả xét nghiệm máu của bạn";
        String donationDate = appointment != null ? appointment.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "không xác định";
        String location = appointment != null ? appointment.getLocation() : "không xác định";
        String bloodGroup = donor.getBloodType() != null ? donor.getBloodType().getBloodGroup() : "chưa xác định";

        String resultText;
        if (result.getIsSafe()) {
            resultText = "KQ: Nhóm máu " + bloodGroup + ", âm tính với VR HIV, VR viêm gan B, VR viêm gan C, VK giang mai.\n(Đã có lỗi xảy ra trong quá trình tạo giấy chứng nhận, chúng tôi sẽ gửi lại sau.)";
        } else {
            resultText = "KQ: Máu của bạn không đạt tiêu chuẩn an toàn. Lý do: " + result.getNotes() + ". Vui lòng liên hệ cơ sở y tế để được tư vấn chi tiết.";
        }

        String emailBody = String.format(
                "Trân trọng cảm ơn quý vị đã tham gia Hiến máu vào ngày %s tại %s.\n\n" +
                        "%s\n\n" +
                        "Kính mong quý vị sẽ tiếp tục tham gia Hiến máu trong các chương trình tiếp theo. LH: 0338203440",
                donationDate, location, resultText
        );

        try {
            emailService.sendEmail(recipientEmail, subject, emailBody);
            log.info("Successfully sent simple email notification to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send simple email to {}", recipientEmail, e);
        }
    }

    // Hàm helper để tìm quy trình theo ID
    private DonationProcess findProcessById(Long processId) {
        return donationProcessRepository.findById(processId)
                .orElseThrow(() -> new EntityNotFoundException("Donation process not found with id: " + processId));
    }

    // Hàm helper để chuyển đổi Entity sang DTO
    public DonationProcessResponse mapToResponse(DonationProcess entity) {
        DonationProcessResponse response = new DonationProcessResponse();
        BeanUtils.copyProperties(entity, response, "donor", "donationAppointment", "healthCheck");

        if (entity.getDonor() != null) {
            response.setDonor(userService.mapToUserResponse(entity.getDonor()));
        }
        if (entity.getDonationAppointment() != null) {
            response.setAppointment(appointmentService.mapToResponse(entity.getDonationAppointment()));
        }
        if (entity.getHealthCheck() != null) {
            response.setHealthCheck(mapToHealthCheckResponse(entity.getHealthCheck()));
        }
        return response;
    }

    // Hàm helper để map HealthCheck sang DTO
    private HealthCheckResponse mapToHealthCheckResponse(HealthCheck entity) {
        if (entity == null) return null;
        HealthCheckResponse response = new HealthCheckResponse();
        BeanUtils.copyProperties(entity, response);
        return response;
    }
}