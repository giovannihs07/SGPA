package com.sgpa.service;

import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.response.LoginResponse;
import com.sgpa.model.users.Persona;
import com.sgpa.model.users.User;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse completarLogin(String email, List<String> roles) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException(
                "Usuario no encontrado: " + email));

        Persona persona = user.getPersona();
        Long personaId = persona != null ? persona.getId() : null;
        String nombre = persona != null ? persona.getNombre() : null;
        String apellido = persona != null ? persona.getApellido() : null;

        String token = jwtTokenService.generarToken(email, roles);

        return LoginResponse.builder()
            .token(token)
            .userId(user.getId())
            .personaId(personaId)
            .email(email)
            .nombre(nombre)
            .apellido(apellido)
            .roles(roles)
            .message(String.format("¡Hola %s, has iniciado sesión con éxito!", email))
            .build();
    }
}
