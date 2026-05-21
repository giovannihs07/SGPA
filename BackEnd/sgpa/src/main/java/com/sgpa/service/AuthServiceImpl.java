package com.sgpa.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository RoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void cambiarPassword(String email, String passwordActual, String passwordNuevo) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(passwordActual, user.getPassword()))
            throw new IllegalArgumentException(
                    "La contraseña actual es incorrecta");

        user.setPassword(passwordEncoder.encode(passwordNuevo));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void cambiarRoles(Long userId, Set<String> nuevosRoles) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Set<Role> roles = nuevosRoles.stream()
                .map(nombre -> RoleRepository.findByName(RoleName.valueOf(nombre))
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + nombre)))
                .collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);
    }
}
