package com.sgpa.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.UserRegisterRequest;
import com.sgpa.dto.response.UserLoginResponse;
import com.sgpa.exception.PersonaNotFoundException;
import com.sgpa.mapper.UserLoginMapper;
import com.sgpa.mapper.UserRegisterMapper;
import com.sgpa.model.Persona;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.User;
import com.sgpa.repository.PersonaRepository;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository repository; // Inyección del repositorio para acceder a la base de datos

    @Autowired
    private RoleRepository roleRepository; // Inyección del repositorio de roles para asignar roles a los usuarios

    @Autowired
    private PersonaRepository personaRepository; // Inyección del repositorio de personas
    
    @Autowired
    private PasswordEncoder passwordEncoder; // Inyección del PasswordEncoder para encriptar contraseñas
    
    @Autowired
    private UserLoginMapper userLoginMapper;

    @Autowired
    private UserRegisterMapper userRegisterMapper;
    
    //Obtener todos
    @Override
    @Transactional(readOnly = true)
    public List<UserLoginResponse> findAll() {
        return userLoginMapper.toResponseList((List<User>) repository.findAll());
    }

    //Obtener por id
    @Override
    @Transactional(readOnly = true)
    public Optional<UserLoginResponse> findById(Long id) {
        return repository.findById(id).map(userLoginMapper::toResponse);
    }

    //Guardar
    @Override
    @Transactional
    public UserLoginResponse save(UserRegisterRequest request) {

        User user = userRegisterMapper.toEntity(request); // Mapeamos el DTO a una entidad User
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encriptamos la contraseña antes de guardarla
        
        // Buscar y asignar la Persona
        Optional<Persona> persona = personaRepository.findById(request.getPersonaId());
        if (persona.isEmpty()) {
            throw new PersonaNotFoundException(request.getPersonaId());
        }
        user.setPersona(persona.get());
        
        List<Role> roles = new ArrayList<>();
        
        if (request.isSuperAdmin()) {
            roleRepository.findByName("ROLE_SUPER_ADMIN").ifPresent(roles::add);
        } else if (request.isAdmin()) {
            roleRepository.findByName("ROLE_ADMIN").ifPresent(roles::add);
        } else {
            // ROLE_DOCENTE por defecto
            roleRepository.findByName("ROLE_DOCENTE").ifPresent(roles::add);
        }

        user.setRoles(roles); // Asignamos el rol al usuario

        User saved = repository.save(user); // Guardamos el usuario en la base de datos y obtenemos la entidad guardada con su ID generado
        return userLoginMapper.toResponse(saved); // Mapeamos la entidad guardada a un DTO UserResponse y lo retornamos
    }

    //Eliminar por id
    @Override
    @Transactional
    public void remove(Long id) {
        repository.deleteById(id);
    }

    // Actualizar por id
    @Override
    @Transactional
    public Optional<UserLoginResponse> update(UserRegisterRequest request, Long id) {
        Optional<User> o = repository.findById(id);
        if (o.isPresent()) {
            User userDb = o.orElseThrow();
            userDb.setEmail(request.getEmail());
            // Solo actualizamos la contraseña si se proporciona una nueva contraseña no vacía
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                userDb.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            
            // Actualizar la Persona si se proporciona un personaId válido
            if (request.getPersonaId() != null) {
                Optional<Persona> persona = personaRepository.findById(request.getPersonaId());
                if (persona.isEmpty()) {
                    throw new PersonaNotFoundException(request.getPersonaId());
                }
                userDb.setPersona(persona.get());
            }
            
            User saved = repository.save(userDb);
            return Optional.of(userLoginMapper.toResponse(saved));
        }
        return Optional.empty();
    }
}
