package com.sgpa.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.backend.dto.request.UserRequest;
import com.sgpa.backend.model.User;
import com.sgpa.backend.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository repository;

    //Obtener todos
    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return (List<User>) repository.findAll();
    }

    //Obtener por id
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return repository.findById(id);
    }

    //Guardar (DTO a Entity)
    @Override
    @Transactional
    public User save(UserRequest request) {
        User user = mapToEntity(request);
        return repository.save(user);
    }

    //Eliminar por id
    @Override
    @Transactional
    public void remove(Long id) {
        repository.deleteById(id);
    }

    public UserRepository getRepository() {
        return repository;
    }

    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }

    // Actualizar por id (DTO a Entity)
    @Override
    @Transactional
    public Optional<User> update(UserRequest request, Long id) {
        Optional<User> o = this.findById(id);
        if (o.isPresent()) {
            User userDb = o.orElseThrow();
            userDb.setUsername(request.getUsername());
            userDb.setEmail(request.getEmail());
            return Optional.of(repository.save(userDb));
        }
        return Optional.empty();
    }

    // Método privado para mapear DTO → Entity
    private User mapToEntity(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // Luego agregar password encriptado
        // user.setPassword(...);

        return user;
    }
}
