package com.hicode.backend.service;

import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.RequestStatus;
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
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    /**
     * Tạo một yêu cầu cần máu mới (do Staff/Admin thực hiện).
     */
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

        // Gửi thông báo đến các người hiến máu phù hợp
        sendNotificationToAvailableDonors(savedRequest);

        return savedRequest;
    }

    /**
     * Lấy danh sách các yêu cầu đang hoạt động (PENDING) cho Member xem.
     */
    public List<BloodRequest> searchActiveRequests() {
        return bloodRequestRepository.findByStatusWithDetails(RequestStatus.PENDING);
    }

    /**
     * Lấy chi tiết một yêu cầu máu theo ID.
     */
    public BloodRequest getRequestById(Long id) {
        return bloodRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found with id: " + id));
    }

    /**
     * Cho phép một Member đăng ký hiến tặng cho một yêu cầu cụ thể.
     */
    @Transactional
    public DonationPledge pledgeForRequest(Long requestId) {
        User currentUser = userService.getCurrentUser();
        BloodRequest bloodRequest = getRequestById(requestId);

        // Kiểm tra xem user đã đăng ký cho yêu cầu này chưa
        boolean alreadyPledged = bloodRequest.getPledges().stream()
                .anyMatch(p -> p.getDonor().getId().equals(currentUser.getId()));
        if (alreadyPledged) {
            throw new IllegalStateException("You have already pledged for this blood request.");
        }

        DonationPledge pledge = new DonationPledge();
        pledge.setDonor(currentUser);
        pledge.setBloodRequest(bloodRequest);

        DonationPledge savedPledge = pledgeRepository.save(pledge);

        // Kiểm tra và cập nhật trạng thái của yêu cầu máu nếu đã đủ số lượng
        checkAndUpdateRequestStatus(bloodRequest);

        return savedPledge;
    }

    /**
     * Hàm nội bộ để kiểm tra và cập nhật trạng thái yêu cầu máu.
     */
    private void checkAndUpdateRequestStatus(BloodRequest bloodRequest) {
        // Tải lại đối tượng để có danh sách pledges mới nhất
        BloodRequest updatedRequest = bloodRequestRepository.findById(bloodRequest.getId())
                .orElseThrow(() -> new EntityNotFoundException("Blood request not found during status check."));

        int requiredQuantity = updatedRequest.getQuantityInUnits();
        int currentPledges = updatedRequest.getPledges().size();

        System.out.println("Checking status for request ID " + updatedRequest.getId() + ": " + currentPledges + "/" + requiredQuantity + " pledges.");

        if (currentPledges >= requiredQuantity) {
            updatedRequest.setStatus(RequestStatus.FULFILLED);
            bloodRequestRepository.save(updatedRequest);
            System.out.println("Request ID " + updatedRequest.getId() + " is now FULFILLED.");
        }
    }

    /**
     * Gửi email thông báo bất đồng bộ đến các người hiến máu phù hợp.
     */
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
}