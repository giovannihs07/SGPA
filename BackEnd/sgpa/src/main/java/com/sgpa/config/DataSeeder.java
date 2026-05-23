package com.sgpa.config;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.model.Persona;
import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;
import com.sgpa.repository.PersonaRepository;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.superadmin.email}")
    private String superAdminEmail;

    @Value("${app.superadmin.password}")
    private String superAdminPassword;

    @Value("${app.superadmin.nombre}")
    private String superAdminNombre;

    @Value("${app.superadmin.cedula}")
    private String superAdminCedula;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        crearRolesSiNoExisten();
        crearSuperAdminSiNoExiste();
    }

    private void crearRolesSiNoExisten() {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(null, roleName)));
        }
    }

    private void crearSuperAdminSiNoExiste() {
        if (userRepository.existsByEmail(superAdminEmail))
            return;

        Persona persona = new Persona();
        persona.setNombre(superAdminNombre);
        persona.setApellido("Admin");
        persona.setCedula(superAdminCedula);
        personaRepository.save(persona);

        Role rolSuperAdmin = roleRepository
            .findByName(RoleName.ROLE_SUPER_ADMIN).orElseThrow();

        User superAdmin = new User();
        superAdmin.setEmail(superAdminEmail);
        superAdmin.setPassword(passwordEncoder.encode(superAdminPassword));
        superAdmin.setEstado(EstadoUsuario.ACTIVO);
        superAdmin.setPersona(persona);
        superAdmin.setRoles(Set.of(rolSuperAdmin));
        userRepository.save(superAdmin);
    }
}
