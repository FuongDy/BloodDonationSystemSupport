package com.hicode.backend.config;

import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;

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
        createRoleIfNotFound("Guest", "[\"view_public_content\"]", "Public users with limited access");
        createRoleIfNotFound("Member", "[\"view_content\", \"request_blood\", \"view_profile\"]", "Registered users - donors and requesters");
        createRoleIfNotFound("Staff", "[\"manage_donations\", \"manage_inventory\", \"view_reports\"]", "Medical staff and technicians");
        createRoleIfNotFound("Admin", "[\"full_access\", \"manage_users\", \"manage_system\"]", "System administrators");
    }

    private void initializeBloodTypes() {
        // O+
        createBloodTypeIfNotFound("O+", BloodComponentType.WHOLE_BLOOD, "Whole Blood O+", 450);
        createBloodTypeIfNotFound("O+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells O+", 350);
        createBloodTypeIfNotFound("O+", BloodComponentType.PLASMA, "Plasma O+", 200);
        createBloodTypeIfNotFound("O+", BloodComponentType.PLATELETS, "Platelets O+", 250);
        // O-
        createBloodTypeIfNotFound("O-", BloodComponentType.WHOLE_BLOOD, "Whole Blood O-", 450);
        createBloodTypeIfNotFound("O-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells O- (Universal Donor)", 350);
        createBloodTypeIfNotFound("O-", BloodComponentType.PLASMA, "Plasma O-", 200);
        createBloodTypeIfNotFound("O-", BloodComponentType.PLATELETS, "Platelets O-", 250);
        // A+
        createBloodTypeIfNotFound("A+", BloodComponentType.WHOLE_BLOOD, "Whole Blood A+", 450);
        createBloodTypeIfNotFound("A+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells A+", 350);
        createBloodTypeIfNotFound("A+", BloodComponentType.PLASMA, "Plasma A+", 200);
        createBloodTypeIfNotFound("A+", BloodComponentType.PLATELETS, "Platelets A+", 250);
        // A-
        createBloodTypeIfNotFound("A-", BloodComponentType.WHOLE_BLOOD, "Whole Blood A-", 450);
        createBloodTypeIfNotFound("A-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells A-", 350);
        createBloodTypeIfNotFound("A-", BloodComponentType.PLASMA, "Plasma A-", 200);
        createBloodTypeIfNotFound("A-", BloodComponentType.PLATELETS, "Platelets A-", 250);
        // B+
        createBloodTypeIfNotFound("B+", BloodComponentType.WHOLE_BLOOD, "Whole Blood B+", 450);
        createBloodTypeIfNotFound("B+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells B+", 350);
        createBloodTypeIfNotFound("B+", BloodComponentType.PLASMA, "Plasma B+", 200);
        createBloodTypeIfNotFound("B+", BloodComponentType.PLATELETS, "Platelets B+", 250);
        // B-
        createBloodTypeIfNotFound("B-", BloodComponentType.WHOLE_BLOOD, "Whole Blood B-", 450);
        createBloodTypeIfNotFound("B-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells B-", 350);
        createBloodTypeIfNotFound("B-", BloodComponentType.PLASMA, "Plasma B-", 200);
        createBloodTypeIfNotFound("B-", BloodComponentType.PLATELETS, "Platelets B-", 250);
        // AB+
        createBloodTypeIfNotFound("AB+", BloodComponentType.WHOLE_BLOOD, "Whole Blood AB+", 450);
        createBloodTypeIfNotFound("AB+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells AB+", 350);
        createBloodTypeIfNotFound("AB+", BloodComponentType.PLASMA, "Plasma AB+ (Universal Donor)", 200);
        createBloodTypeIfNotFound("AB+", BloodComponentType.PLATELETS, "Platelets AB+", 250);
        // AB-
        createBloodTypeIfNotFound("AB-", BloodComponentType.WHOLE_BLOOD, "Whole Blood AB-", 450);
        createBloodTypeIfNotFound("AB-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells AB-", 350);
        createBloodTypeIfNotFound("AB-", BloodComponentType.PLASMA, "Plasma AB-", 200);
        createBloodTypeIfNotFound("AB-", BloodComponentType.PLATELETS, "Platelets AB-", 250);
    }

    private void initializeBloodCompatibilities() {
        List<BloodType> allTypes = bloodTypeRepository.findAll();

        // ---- ** BỘ QUY TẮC CHO HỒNG CẦU (RED BLOOD CELLS) ** ----
        System.out.println("Initializing Red Blood Cell compatibility rules...");
        Map<String, BloodType> rbcMap = allTypes.stream()
                .filter(bt -> bt.getComponentType() == BloodComponentType.RED_BLOOD_CELLS)
                .collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));

        // Donor O- (cho tất cả)
        addCompatibility(rbcMap, "O-", "O-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "O-", "O+", true, "Rule for Red Blood Cells");
        addCompatibility(rbcMap, "O-", "A-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "O-", "A+", true, "Rule for Red Blood Cells");
        addCompatibility(rbcMap, "O-", "B-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "O-", "B+", true, "Rule for Red Blood Cells");
        addCompatibility(rbcMap, "O-", "AB-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "O-", "AB+", true, "Rule for Red Blood Cells");
        // Donor O+
        addCompatibility(rbcMap, "O+", "O+", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "O+", "A+", true, "Rule for Red Blood Cells");
        addCompatibility(rbcMap, "O+", "B+", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "O+", "AB+", true, "Rule for Red Blood Cells");
        // Donor A-
        addCompatibility(rbcMap, "A-", "A-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "A-", "A+", true, "Rule for Red Blood Cells");
        addCompatibility(rbcMap, "A-", "AB-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "A-", "AB+", true, "Rule for Red Blood Cells");
        // Donor A+
        addCompatibility(rbcMap, "A+", "A+", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "A+", "AB+", true, "Rule for Red Blood Cells");
        // Donor B-
        addCompatibility(rbcMap, "B-", "B-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "B-", "B+", true, "Rule for Red Blood Cells");
        addCompatibility(rbcMap, "B-", "AB-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "B-", "AB+", true, "Rule for Red Blood Cells");
        // Donor B+
        addCompatibility(rbcMap, "B+", "B+", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "B+", "AB+", true, "Rule for Red Blood Cells");
        // Donor AB-
        addCompatibility(rbcMap, "AB-", "AB-", true, "Rule for Red Blood Cells"); addCompatibility(rbcMap, "AB-", "AB+", true, "Rule for Red Blood Cells");
        // Donor AB+
        addCompatibility(rbcMap, "AB+", "AB+", true, "Rule for Red Blood Cells");

        // ---- ** BỘ QUY TẮC CHO HUYẾT TƯƠNG (PLASMA) ** ----
        System.out.println("Initializing Plasma compatibility rules...");
        Map<String, BloodType> plasmaMap = allTypes.stream()
                .filter(bt -> bt.getComponentType() == BloodComponentType.PLASMA)
                .collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));

        // Donor AB (cho tất cả)
        addCompatibility(plasmaMap, "AB+", "AB+", true, "Rule for Plasma"); addCompatibility(plasmaMap, "AB+", "A+", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "AB+", "B+", true, "Rule for Plasma"); addCompatibility(plasmaMap, "AB+", "O+", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "AB-", "AB-", true, "Rule for Plasma"); addCompatibility(plasmaMap, "AB-", "A-", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "AB-", "B-", true, "Rule for Plasma"); addCompatibility(plasmaMap, "AB-", "O-", true, "Rule for Plasma");
        // Donor A
        addCompatibility(plasmaMap, "A+", "A+", true, "Rule for Plasma"); addCompatibility(plasmaMap, "A+", "A-", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "A+", "O+", true, "Rule for Plasma"); addCompatibility(plasmaMap, "A+", "O-", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "A-", "A-", true, "Rule for Plasma"); addCompatibility(plasmaMap, "A-", "O-", true, "Rule for Plasma");
        // Donor B
        addCompatibility(plasmaMap, "B+", "B+", true, "Rule for Plasma"); addCompatibility(plasmaMap, "B+", "B-", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "B+", "O+", true, "Rule for Plasma"); addCompatibility(plasmaMap, "B+", "O-", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "B-", "B-", true, "Rule for Plasma"); addCompatibility(plasmaMap, "B-", "O-", true, "Rule for Plasma");
        // Donor O
        addCompatibility(plasmaMap, "O+", "O+", true, "Rule for Plasma"); addCompatibility(plasmaMap, "O+", "O-", true, "Rule for Plasma");
        addCompatibility(plasmaMap, "O-", "O-", true, "Rule for Plasma");

        // ---- ** BỘ QUY TẮC CHO TIỂU CẦU (PLATELETS) ** ----
        System.out.println("Initializing Platelet compatibility rules...");
        Map<String, BloodType> plateletMap = allTypes.stream()
                .filter(bt -> bt.getComponentType() == BloodComponentType.PLATELETS)
                .collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));

        // Donor O
        addCompatibility(plateletMap, "O+", "O+", true, "Rule for Platelets"); addCompatibility(plateletMap, "O+", "A+", true, "Rule for Platelets");
        addCompatibility(plateletMap, "O+", "B+", true, "Rule for Platelets"); addCompatibility(plateletMap, "O+", "AB+", true, "Rule for Platelets");
        addCompatibility(plateletMap, "O-", "O-", true, "Rule for Platelets"); addCompatibility(plateletMap, "O-", "A-", true, "Rule for Platelets");
        addCompatibility(plateletMap, "O-", "B-", true, "Rule for Platelets"); addCompatibility(plateletMap, "O-", "AB-", true, "Rule for Platelets");
        // Donor A
        addCompatibility(plateletMap, "A+", "A+", true, "Rule for Platelets"); addCompatibility(plateletMap, "A+", "AB+", true, "Rule for Platelets");
        addCompatibility(plateletMap, "A-", "A-", true, "Rule for Platelets"); addCompatibility(plateletMap, "A-", "AB-", true, "Rule for Platelets");
        // Donor B
        addCompatibility(plateletMap, "B+", "B+", true, "Rule for Platelets"); addCompatibility(plateletMap, "B+", "AB+", true, "Rule for Platelets");
        addCompatibility(plateletMap, "B-", "B-", true, "Rule for Platelets"); addCompatibility(plateletMap, "B-", "AB-", true, "Rule for Platelets");
        // Donor AB
        addCompatibility(plateletMap, "AB+", "AB+", true, "Rule for Platelets"); addCompatibility(plateletMap, "AB-", "AB-", true, "Rule for Platelets");

        // ---- ** BỘ QUY TẮC CHO MÁU TOÀN PHẦN (WHOLE BLOOD) ** ----
        System.out.println("Initializing Whole Blood compatibility rules...");
        Map<String, BloodType> wholeBloodMap = allTypes.stream()
                .filter(bt -> bt.getComponentType() == BloodComponentType.WHOLE_BLOOD)
                .collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));

        // Quy tắc: Chỉ cùng nhóm máu mới có thể cho nhau
        addCompatibility(wholeBloodMap, "O+", "O+", true, "Rule for Whole Blood");
        addCompatibility(wholeBloodMap, "O-", "O-", true, "Rule for Whole Blood");
        addCompatibility(wholeBloodMap, "A+", "A+", true, "Rule for Whole Blood");
        addCompatibility(wholeBloodMap, "A-", "A-", true, "Rule for Whole Blood");
        addCompatibility(wholeBloodMap, "B+", "B+", true, "Rule for Whole Blood");
        addCompatibility(wholeBloodMap, "B-", "B-", true, "Rule for Whole Blood");
        addCompatibility(wholeBloodMap, "AB+", "AB+", true, "Rule for Whole Blood");
        addCompatibility(wholeBloodMap, "AB-", "AB-", true, "Rule for Whole Blood");
    }

    // --- Helper Methods ---
    private void createRoleIfNotFound(String name, String permissions, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name);
            role.setPermissions(permissions);
            role.setDescription(description);
            roleRepository.save(role);
            System.out.println("Initialized Role: " + name);
        }
    }

    private void createBloodTypeIfNotFound(String group, BloodComponentType component, String desc, Integer volume) {
        if (bloodTypeRepository.findByBloodGroupAndComponentType(group, component).isEmpty()) {
            BloodType bloodType = new BloodType();
            bloodType.setBloodGroup(group);
            bloodType.setComponentType(component);
            bloodType.setDescription(desc);
            bloodType.setVolumeMl(volume);
            bloodTypeRepository.save(bloodType);
            System.out.println("Initialized Blood Type: " + group + " " + component.getDisplayName());
        }
    }

    private void addCompatibility(Map<String, BloodType> typeMap, String donorGroup, String recipientGroup, boolean isCompatible, String notes) {
        BloodType donor = typeMap.get(donorGroup);
        BloodType recipient = typeMap.get(recipientGroup);
        if (donor != null && recipient != null) {
            createCompatibilityIfNotFound(donor, recipient, isCompatible, 100, true, notes);
        }
    }

    private void createCompatibilityIfNotFound(BloodType donor, BloodType recipient, boolean isCompatible, int score, boolean isEmergency, String notes) {
        if (compatibilityRepository.findByDonorBloodTypeIdAndRecipientBloodTypeId(donor.getId(), recipient.getId()).isEmpty()) {
            BloodTypeCompatibility compatibility = new BloodTypeCompatibility();
            compatibility.setDonorBloodType(donor);
            compatibility.setRecipientBloodType(recipient);
            compatibility.setIsCompatible(isCompatible);
            compatibility.setCompatibilityScore(score);
            compatibility.setIsEmergencyCompatible(isEmergency);
            compatibility.setNotes(notes);
            compatibilityRepository.save(compatibility);
            System.out.println("Initialized Compatibility: " + notes + " (" + donor.getBloodGroup() + " -> " + recipient.getBloodGroup() + ")");
        }
    }
}