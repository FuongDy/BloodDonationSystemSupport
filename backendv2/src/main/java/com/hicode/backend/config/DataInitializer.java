package com.hicode.backend.config;

import com.hicode.backend.model.entity.Role;
import com.hicode.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }

    private void initializeRoles() {
        createRoleIfNotFound("Guest", "[\"view_public_content\"]", "Public users with limited access");
        createRoleIfNotFound("Member", "[\"view_content\", \"request_blood\", \"view_profile\"]", "Registered users - donors and requesters");
        createRoleIfNotFound("Staff", "[\"manage_donations\", \"manage_inventory\", \"view_reports\"]", "Medical staff and technicians");
        createRoleIfNotFound("Admin", "[\"full_access\", \"manage_users\", \"manage_system\"]", "System administrators");
    }

    private void createRoleIfNotFound(String name, String permissions, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name);
            role.setPermissions(permissions);
            role.setDescription(description);
            roleRepository.save(role);
            System.out.println("Initialized role: " + name);
        }
    }
}