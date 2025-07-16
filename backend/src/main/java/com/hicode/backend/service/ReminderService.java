package com.hicode.backend.service;

import com.hicode.backend.model.entity.User;
import com.hicode.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    private static final Logger logger = LoggerFactory.getLogger(ReminderService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final int REMINDER_DAYS_PERIOD = 90;

    /**
     * Phương thức này sẽ tự động chạy vào 9:00 sáng mỗi ngày.
     * Cron expression: "giây phút giờ ngày tháng ngày_trong_tuần"
     * "0 0 9 * * ?" -> Chạy lúc 9 giờ 0 phút 0 giây, mỗi ngày.
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDonationReminders() {
        // Tính toán ngày hiến máu mục tiêu (cách đây 180 ngày)
        LocalDate targetDonationDate = LocalDate.now().minusDays(REMINDER_DAYS_PERIOD);
        logger.info("Chạy tác vụ nhắc nhở hiến máu định kỳ. Tìm kiếm người hiến máu vào ngày: {}", targetDonationDate);

        // Tìm tất cả người dùng đã hiến máu vào ngày đó
        List<User> usersToRemind = userRepository.findByLastDonationDate(targetDonationDate);

        if (usersToRemind.isEmpty()) {
            logger.info("Không tìm thấy người dùng nào cần nhắc nhở hôm nay.");
            return;
        }

        logger.info("Tìm thấy {} người dùng cần gửi email nhắc nhở.", usersToRemind.size());

        // Gửi email cho từng người
        for (User user : usersToRemind) {
            sendReminderEmail(user);
        }
    }

    /**
     * Soạn và gửi email nhắc nhở.
     */
    private void sendReminderEmail(User user) {
        String recipientEmail = user.getEmail();
        String subject = "Nhắc nhở: Đã đến lúc hiến máu định kỳ!";

        String emailBody = String.format(
                "Chào %s,\n\n" +
                        "Đã 180 ngày kể từ lần hiến máu cuối cùng của bạn. Giờ là thời điểm tuyệt vời để tiếp tục hành trình cứu người của mình!\n\n" +
                        "Sức khỏe của bạn đã đủ điều kiện để tham gia hiến máu định kỳ. Mỗi giọt máu của bạn đều vô cùng quý giá và có thể mang lại sự sống cho những người đang cần.\n\n" +
                        "Vui lòng truy cập ứng dụng của chúng tôi để đăng ký cho lần hiến máu tiếp theo.\n\n" +
                        "Trân trọng cảm ơn sự đóng góp của bạn,\n" +
                        "Đội ngũ hỗ trợ hiến máu.",
                user.getFullName()
        );

        try {
            emailService.sendEmail(recipientEmail, subject, emailBody);
            logger.info("Đã gửi email nhắc nhở thành công cho: {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Gửi email nhắc nhở thất bại cho {}: {}", recipientEmail, e.getMessage());
        }
    }
}