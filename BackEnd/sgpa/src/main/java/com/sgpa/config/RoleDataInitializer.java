package com.sgpa.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(ApplicationArguments args) {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName).orElseGet(() ->
                roleRepository.save(new Role(null, roleName))
            );
        }
    }
}
