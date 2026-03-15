package com.artisans;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.artisans.entity.Role;
import com.artisans.repository.RoleRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            createRoleIfNotExists(roleRepository, "ROLE_ADMIN");
            createRoleIfNotExists(roleRepository, "ROLE_SELLER");
            createRoleIfNotExists(roleRepository, "ROLE_CUSTOMER");
        };
    }

    private void createRoleIfNotExists(
            RoleRepository roleRepository,
            String roleName) {

        roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
    }
}
