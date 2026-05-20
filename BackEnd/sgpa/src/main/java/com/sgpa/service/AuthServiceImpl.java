package com.sgpa.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sgpa.model.users.User;
import com.sgpa.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
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
}
