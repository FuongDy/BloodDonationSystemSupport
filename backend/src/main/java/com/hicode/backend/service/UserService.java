package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.entity.BloodType;
import com.hicode.backend.entity.Role;
import com.hicode.backend.entity.User;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.RoleRepository;
import com.hicode.backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("No authenticated user found. Please login.");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User principal not found in database: " + email));
    }

    @Transactional
    public UserResponse updateUserProfile(UpdateUserRequest updateUserRequest) {
        User currentUser = getCurrentUser();

        if (updateUserRequest.getFullName() != null) currentUser.setFullName(updateUserRequest.getFullName());
        if (updateUserRequest.getPhone() != null) currentUser.setPhone(updateUserRequest.getPhone());
        if (updateUserRequest.getDateOfBirth() != null) currentUser.setDateOfBirth(updateUserRequest.getDateOfBirth());
        if (updateUserRequest.getGender() != null) currentUser.setGender(updateUserRequest.getGender());
        if (updateUserRequest.getAddress() != null) currentUser.setAddress(updateUserRequest.getAddress());
        if (updateUserRequest.getLatitude() != null) currentUser.setLatitude(updateUserRequest.getLatitude());
        if (updateUserRequest.getLongitude() != null) currentUser.setLongitude(updateUserRequest.getLongitude());
        if (updateUserRequest.getEmergencyContact() != null) currentUser.setEmergencyContact(updateUserRequest.getEmergencyContact());
        if (updateUserRequest.getMedicalConditions() != null) currentUser.setMedicalConditions(updateUserRequest.getMedicalConditions());
        if (updateUserRequest.getLastDonationDate() != null) currentUser.setLastDonationDate(updateUserRequest.getLastDonationDate());
        if (updateUserRequest.getIsReadyToDonate() != null) currentUser.setIsReadyToDonate(updateUserRequest.getIsReadyToDonate());

        if (updateUserRequest.getBloodTypeId() != null) {
            Optional<BloodType> bloodTypeOptional = bloodTypeRepository.findById(updateUserRequest.getBloodTypeId());
            currentUser.setBloodType(bloodTypeOptional.orElse(null));
        } else {
            // If DTO's bloodTypeId is null (meaning client sent it as null or didn't send the field),
            // set user's bloodType to null.
            currentUser.setBloodType(null);
        }

        User updatedUser = userRepository.save(currentUser);
        return mapToUserResponse(updatedUser);
    }

    public UserResponse getUserProfile() {
        User currentUser = getCurrentUser();
        return mapToUserResponse(currentUser);
    }

    public UserResponse mapToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        BeanUtils.copyProperties(user, userResponse, "role", "bloodType", "passwordHash");
        userResponse.setId(user.getId());
        if (user.getRole() != null) {
            userResponse.setRole(user.getRole().getName());
        }
        if (user.getBloodType() != null) {
            userResponse.setBloodTypeDescription(user.getBloodType().getDescription());
        } else {
            userResponse.setBloodTypeDescription(null);
        }
        return userResponse;
    }

    // Sửa phương thức getAllUsers thành searchAllUsers
    public Page<UserResponse> searchAllUsers(String keyword, String roleName, Pageable pageable) {
        Specification<User> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo từ khóa (keyword)
            if (keyword != null && !keyword.trim().isEmpty()) {
                String keywordPattern = "%" + keyword.toLowerCase().trim() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), keywordPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), keywordPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), keywordPattern),
                        criteriaBuilder.like(root.get("phone"), keywordPattern)
                );
                predicates.add(searchPredicate);
            }

            // 2. Lọc theo vai trò (roleName)
            if (roleName != null && !roleName.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("role").get("name"), roleName.trim()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<User> usersPage = userRepository.findAll(spec, pageable);
        return usersPage.map(this::mapToUserResponse);
    }

    @Transactional
    public UserResponse createUserByAdmin(AdminCreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Error: Username '" + request.getUsername() + "' is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email '" + request.getEmail() + "' is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Error: Role '" + request.getRoleName() + "' not found."));
        user.setRole(role);

        if (request.getBloodTypeId() != null) {
            Optional<BloodType> bloodTypeOptional = bloodTypeRepository.findById(request.getBloodTypeId());
            user.setBloodType(bloodTypeOptional.orElse(null));
        } else {
            user.setBloodType(null);
        }

        user.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
        user.setEmailVerified(request.getEmailVerified() != null ? request.getEmailVerified() : false);
        user.setPhoneVerified(request.getPhoneVerified() != null ? request.getPhoneVerified() : false);

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    public UserResponse getUserByIdForAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserByAdmin(Long userId, AdminUpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getLatitude() != null) user.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) user.setLongitude(request.getLongitude());
        if (request.getEmergencyContact() != null) user.setEmergencyContact(request.getEmergencyContact());
        if (request.getMedicalConditions() != null) user.setMedicalConditions(request.getMedicalConditions());
        if (request.getLastDonationDate() != null) user.setLastDonationDate(request.getLastDonationDate());
        if (request.getIsReadyToDonate() != null) user.setIsReadyToDonate(request.getIsReadyToDonate());
        if (request.getEmailVerified() != null) user.setEmailVerified(request.getEmailVerified());
        if (request.getPhoneVerified() != null) user.setPhoneVerified(request.getPhoneVerified());

        if (request.getBloodTypeId() != null) {
            Optional<BloodType> bloodTypeOptional = bloodTypeRepository.findById(request.getBloodTypeId());
            user.setBloodType(bloodTypeOptional.orElse(null));
        } else {
            user.setBloodType(null); // If admin sends null for bloodTypeId, clear it
        }

        if (request.getRoleName() != null && (user.getRole() == null || !request.getRoleName().equals(user.getRole().getName()))) {
            Role newRole = roleRepository.findByName(request.getRoleName())
                    .orElseThrow(() -> new RuntimeException("Error: Role '" + request.getRoleName() + "' not found."));
            user.setRole(newRole);
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Transactional
    public UserResponse softDeleteUserByAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setStatus("Suspended");
        User deactivatedUser = userRepository.save(user);
        return mapToUserResponse(deactivatedUser);
    }

    // --- Thêm phương thức service mới ---
    public List<DonorSearchResponse> findDonorsByDistance(double latitude, double longitude, double distanceInKm, Integer bloodTypeId) {
        List<User> foundUsers = userRepository.findDonorsInRadius(latitude, longitude, distanceInKm, bloodTypeId);
        List<DonorSearchResponse> responseList = new ArrayList<>();

        for (User user : foundUsers) {
            // Tính lại khoảng cách để hiển thị (tránh gọi lại query phức tạp)
            double calculatedDistance = haversine(latitude, longitude, user.getLatitude(), user.getLongitude());
            UserResponse userResponse = mapToUserResponse(user); // Dùng lại phương thức map đã có
            responseList.add(new DonorSearchResponse(userResponse, calculatedDistance));
        }

        // Sắp xếp kết quả theo khoảng cách gần nhất
        responseList.sort(Comparator.comparingDouble(DonorSearchResponse::getDistanceInKm));

        return responseList;
    }

    // Hàm phụ để tính khoảng cách Haversine
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        if ((lat1 == lat2 && lon1 == lon2) || lat2 == 0 || lon1 == 0) { // Thêm kiểm tra null/zero cho tọa độ user
            return 0;
        }
        final int R = 6371; // Bán kính Trái Đất bằng km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}