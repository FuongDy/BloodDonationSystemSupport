package com.hicode.backend.config;

import com.hicode.backend.model.entity.BloodType;
import com.hicode.backend.model.entity.Role;
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

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeBloodTypes();
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
}