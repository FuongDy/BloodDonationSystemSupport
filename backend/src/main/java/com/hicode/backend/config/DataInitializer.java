package com.hicode.backend.config;

import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.BloodTypeCompatibility;
import com.hicode.backend.model.entity.Role;
import com.hicode.backend.repository.BloodTypeCompatibilityRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private BloodTypeCompatibilityRepository compatibilityRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeBloodTypes();
        initializeBloodCompatibilities();
    }

    private void initializeRoles() {
        createRoleIfNotFound("Guest", "Public users with limited access");
        createRoleIfNotFound("Member", "Registered users");
        createRoleIfNotFound("Staff", "Medical staff");
        createRoleIfNotFound("Admin", "System administrators");
    }

    private void createRoleIfNotFound(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name);
            role.setDescription(description);
            roleRepository.save(role);
        }
    }

    private void initializeBloodTypes() {
        // Chỉ tạo 8 nhóm máu cơ bản
        createBloodTypeIfNotFound("O-", "O Rh-Negative (Universal Donor)");
        createBloodTypeIfNotFound("O+", "O Rh-Positive");
        createBloodTypeIfNotFound("A-", "A Rh-Negative");
        createBloodTypeIfNotFound("A+", "A Rh-Positive");
        createBloodTypeIfNotFound("B-", "B Rh-Negative");
        createBloodTypeIfNotFound("B+", "B Rh-Positive");
        createBloodTypeIfNotFound("AB-", "AB Rh-Negative");
        createBloodTypeIfNotFound("AB+", "AB Rh-Positive (Universal Recipient)");
    }

    private void createBloodTypeIfNotFound(String group, String desc) {
        // Phương thức đã được đơn giản hóa - use findAll to avoid unique constraint issue
        boolean exists = bloodTypeRepository.findAll().stream()
                .anyMatch(bt -> bt.getBloodGroup().equals(group));
        
        if (!exists) {
            BloodType bloodType = new BloodType();
            bloodType.setBloodGroup(group);
            bloodType.setDescription(desc);
            bloodTypeRepository.save(bloodType);
            System.out.println("Initialized Blood Type: " + group);
        }
    }

    private void initializeBloodCompatibilities() {
        // Nếu đã có dữ liệu thì không chạy lại
        if (compatibilityRepository.count() > 0) {
            return;
        }

        System.out.println("Initializing blood compatibility rules...");

        // Lấy tất cả các nhóm máu đã tạo
        List<BloodType> allTypes = bloodTypeRepository.findAll();
        Map<String, BloodType> typeMap = allTypes.stream()
                .collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));

        // Quy tắc hiến máu (Donor -> Recipient)
        // O- có thể cho tất cả
        addCompatibility(typeMap, "O-", "O-"); addCompatibility(typeMap, "O-", "O+");
        addCompatibility(typeMap, "O-", "A-"); addCompatibility(typeMap, "O-", "A+");
        addCompatibility(typeMap, "O-", "B-"); addCompatibility(typeMap, "O-", "B+");
        addCompatibility(typeMap, "O-", "AB-"); addCompatibility(typeMap, "O-", "AB+");

        // O+ có thể cho các nhóm Rh+
        addCompatibility(typeMap, "O+", "O+"); addCompatibility(typeMap, "O+", "A+");
        addCompatibility(typeMap, "O+", "B+"); addCompatibility(typeMap, "O+", "AB+");

        // A- có thể cho A và AB
        addCompatibility(typeMap, "A-", "A-"); addCompatibility(typeMap, "A-", "A+");
        addCompatibility(typeMap, "A-", "AB-"); addCompatibility(typeMap, "A-", "AB+");

        // A+ có thể cho A+ và AB+
        addCompatibility(typeMap, "A+", "A+"); addCompatibility(typeMap, "A+", "AB+");

        // B- có thể cho B và AB
        addCompatibility(typeMap, "B-", "B-"); addCompatibility(typeMap, "B-", "B+");
        addCompatibility(typeMap, "B-", "AB-"); addCompatibility(typeMap, "B-", "AB+");

        // B+ có thể cho B+ và AB+
        addCompatibility(typeMap, "B+", "B+"); addCompatibility(typeMap, "B+", "AB+");

        // AB- có thể cho AB
        addCompatibility(typeMap, "AB-", "AB-"); addCompatibility(typeMap, "AB-", "AB+");

        // AB+ chỉ có thể cho AB+
        addCompatibility(typeMap, "AB+", "AB+");

        System.out.println("Finished initializing blood compatibility rules.");
    }

    private void addCompatibility(Map<String, BloodType> typeMap, String donorGroup, String recipientGroup) {
        BloodType donor = typeMap.get(donorGroup);
        BloodType recipient = typeMap.get(recipientGroup);

        // Chỉ tạo nếu cả hai tồn tại và quy tắc chưa có
        if (donor != null && recipient != null &&
                compatibilityRepository.findByDonorBloodTypeIdAndRecipientBloodTypeId(donor.getId(), recipient.getId()).isEmpty()) {
            BloodTypeCompatibility compatibility = new BloodTypeCompatibility();
            compatibility.setDonorBloodType(donor);
            compatibility.setRecipientBloodType(recipient);
            compatibility.setIsCompatible(true);
            compatibility.setNotes("Standard compatibility");
            compatibilityRepository.save(compatibility);
        }
    }
}