package com.sgpa.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.backend.dto.request.UserRequest;
import com.sgpa.backend.dto.response.UserResponse;
import com.sgpa.backend.mapper.UserMapper;
import com.sgpa.backend.model.users.Role;
import com.sgpa.backend.model.users.User;
import com.sgpa.backend.repository.RoleRepository;
import com.sgpa.backend.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository repository; // Inyección del repositorio para acceder a la base de datos

    @Autowired
    private RoleRepository roleRepository; // Inyección del repositorio de roles para asignar roles a los usuarios

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyección del PasswordEncoder para encriptar contraseñas
    
    @Autowired
    private UserMapper userMapper;
    
    //Obtener todos
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userMapper.toResponseList((List<User>) repository.findAll());
    }

    //Obtener por id
    @Override
    @Transactional(readOnly = true)
    public Optional<UserResponse> findById(Long id) {
        return repository.findById(id).map(userMapper::toResponse);
    }

    //Guardar
    @Override
    @Transactional
    public UserResponse save(UserRequest request) {

        User user = userMapper.toEntity(request); // Mapeamos el DTO a una entidad User
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encriptamos la contraseña antes de guardarla
        
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
        return userMapper.toResponse(saved); // Mapeamos la entidad guardada a un DTO UserResponse y lo retornamos
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
    public Optional<UserResponse> update(UserRequest request, Long id) {
        Optional<User> o = repository.findById(id);
        if (o.isPresent()) {
            User userDb = o.orElseThrow();
            userDb.setEmail(request.getEmail());
            // Solo actualizamos la contraseña si se proporciona una nueva contraseña no vacía
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                userDb.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            User saved = repository.save(userDb);
            return Optional.of(userMapper.toResponse(saved));
        }
        return Optional.empty();
    }
}
