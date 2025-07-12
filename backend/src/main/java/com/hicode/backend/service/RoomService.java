package com.hicode.backend.service;

import com.hicode.backend.dto.admin.RoomStatusResponse;
import com.hicode.backend.model.entity.BloodRequest;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.model.enums.UrgencyLevel;
import com.hicode.backend.repository.BloodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    private static final int TOTAL_ROOMS = 16;
    private static final int NORMAL_CAPACITY = 6;
    private static final int EMERGENCY_CAPACITY = 8;

    @Transactional(readOnly = true)
    public List<RoomStatusResponse> getAllRoomStatuses() {
        // Lấy tất cả các yêu cầu đang PENDING để tính toán
        List<BloodRequest> activeRequests = bloodRequestRepository.findByStatus(RequestStatus.PENDING);

        // Nhóm các yêu cầu theo số phòng
        Map<Integer, List<BloodRequest>> requestsByRoom = activeRequests.stream()
                .filter(req -> req.getRoomNumber() != null)
                .collect(Collectors.groupingBy(BloodRequest::getRoomNumber));

        List<RoomStatusResponse> allRoomStatuses = new ArrayList<>();

        for (int i = 1; i <= TOTAL_ROOMS; i++) {
            List<BloodRequest> requestsInRoom = requestsByRoom.getOrDefault(i, new ArrayList<>());

            // Mặc định sức chứa là 6
            int capacity = NORMAL_CAPACITY;
            // Nếu có ít nhất 1 ca URGENT hoặc CRITICAL trong phòng, sức chứa nâng lên 8
            boolean isEmergency = requestsInRoom.stream()
                    .anyMatch(req -> req.getUrgency() == UrgencyLevel.URGENT || req.getUrgency() == UrgencyLevel.CRITICAL);
            if (isEmergency) {
                capacity = EMERGENCY_CAPACITY;
            }

            int occupancy = requestsInRoom.size();
            List<Integer> occupiedBeds = requestsInRoom.stream()
                    .map(BloodRequest::getBedNumber)
                    .sorted()
                    .collect(Collectors.toList());

            allRoomStatuses.add(new RoomStatusResponse(i, capacity, occupancy, occupiedBeds));
        }

        return allRoomStatuses;
    }
}