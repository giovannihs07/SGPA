package com.sgpa.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.UserRequest;
import com.sgpa.dto.request.UserRegisterRequest;
import com.sgpa.dto.response.UserRegisterResponse;
import com.sgpa.dto.response.UserResponse;
import com.sgpa.exception.PersonaNotFoundException;
import com.sgpa.mapper.UserMapper;
import com.sgpa.mapper.UserRegisterMapper;
import com.sgpa.model.Persona;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;
import com.sgpa.repository.PersonaRepository;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final RoleRepository roleRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserRegisterMapper userRegisterMapper;

    @Override
    @Transactional
    public UserRegisterResponse register(UserRegisterRequest request) {
        User user = userRegisterMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPersona(findPersona(request.getPersonaId()));
        user.setRoles(resolveRoles(request.getRoles()));

        return userRegisterMapper.toResponse(repository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        List<User> users = new ArrayList<>();
        repository.findAll().forEach(users::add);
        return userMapper.toResponseList(users);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserResponse> findById(Long id) {
        return repository.findById(id).map(userMapper::toResponse);
    }

    @Override
    @Transactional
    public UserResponse save(UserRequest request) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria al crear un usuario");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPersona(findPersona(request.getPersonaId()));
        user.setRoles(resolveRoles(request.getRoles()));

        return userMapper.toResponse(repository.save(user));
    }

    @Override
    @Transactional
    public Optional<UserResponse> update(UserRequest request, Long id) {
        return repository.findById(id).map(user -> {
            userMapper.updateEntity(user, request);

            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            if (request.getPersonaId() != null) {
                user.setPersona(findPersona(request.getPersonaId()));
            }

            if (request.getRoles() != null && !request.getRoles().isEmpty()) {
                user.setRoles(resolveRoles(request.getRoles()));
            }

            return userMapper.toResponse(repository.save(user));
        });
    }

    @Override
    @Transactional
    public void remove(Long id) {
        repository.deleteById(id);
    }

    private Persona findPersona(Long personaId) {
        return personaRepository.findById(personaId)
            .orElseThrow(() -> new PersonaNotFoundException(personaId));
    }

    private Set<Role> resolveRoles(List<RoleName> roleNames) {
        List<RoleName> names = (roleNames == null || roleNames.isEmpty())
            ? List.of(RoleName.ROLE_DOCENTE)
            : roleNames;

        Set<Role> roles = new HashSet<>();
        for (RoleName roleName : names) {
            Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + roleName));
            roles.add(role);
        }
        return roles;
    }
}
