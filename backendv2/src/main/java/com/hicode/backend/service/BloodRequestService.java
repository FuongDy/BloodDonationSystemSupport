package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.dto.admin.BloodRequestResponse;
import com.hicode.backend.dto.admin.CreateBloodRequestRequest;
import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.RequestStatus;
import com.hicode.backend.repository.BloodRequestRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {

    @Autowired private BloodRequestRepository bloodRequestRepository;
    @Autowired private BloodTypeRepository bloodTypeRepository;
    @Autowired private UserService userService;

    @Transactional
    public BloodRequestResponse createBloodRequest(CreateBloodRequestRequest request) {
        User currentUser = userService.getCurrentUser();
        BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                .orElseThrow(() -> new EntityNotFoundException("BloodType not found."));

        BloodRequest newRequest = new BloodRequest();
        BeanUtils.copyProperties(request, newRequest);
        newRequest.setRequester(currentUser);
        newRequest.setBloodType(bloodType);
        newRequest.setStatus(RequestStatus.PENDING);

        BloodRequest savedRequest = bloodRequestRepository.save(newRequest);
        return mapToResponse(savedRequest);
    }

    @Transactional(readOnly = true)
    public List<BloodRequestResponse> searchActiveRequests(LocationSearchRequest request) {
        List<BloodRequest> requests = bloodRequestRepository.findActiveRequestsWithinRadius(
                request.getLatitude(),
                request.getLongitude(),
                request.getRadius(),
                request.getBloodTypeId(),
                RequestStatus.PENDING.name()
        );
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BloodRequestResponse getRequestById(Long id) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood Request not found with id: " + id));
        return mapToResponse(request);
    }

    @Transactional
    public BloodRequestResponse updateRequestStatus(Long id, RequestStatus newStatus) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood Request not found with id: " + id));

        // Thêm logic kiểm tra quyền (ví dụ: chỉ Admin/Staff mới được đổi trạng thái)

        request.setStatus(newStatus);
        BloodRequest updatedRequest = bloodRequestRepository.save(request);
        return mapToResponse(updatedRequest);
    }

    @Transactional
    public void cancelRequest(Long id) {
        User currentUser = userService.getCurrentUser();
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Blood Request not found with id: " + id));

        // Chỉ người tạo ra yêu cầu mới có quyền hủy
        if (!Objects.equals(request.getRequester().getId(), currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to cancel this request.");
        }

        request.setStatus(RequestStatus.CANCELLED);
        bloodRequestRepository.save(request);
    }

    private BloodRequestResponse mapToResponse(BloodRequest entity) {
        if (entity == null) return null;
        BloodRequestResponse response = new BloodRequestResponse();
        BeanUtils.copyProperties(entity, response, "requester", "bloodType");

        if (entity.getRequester() != null) {
            response.setRequester(userService.mapToUserResponse(entity.getRequester()));
        }
        if (entity.getBloodType() != null) {
            com.hicode.backend.dto.admin.BloodTypeResponse btr = new com.hicode.backend.dto.admin.BloodTypeResponse();
            BeanUtils.copyProperties(entity.getBloodType(), btr);
            response.setBloodType(btr);
        }
        return response;
    }
}