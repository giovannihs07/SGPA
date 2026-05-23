package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.model.users.User;

public interface UserRepository extends CrudRepository<User, Long>{
    List<User> findAll();
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByPersonaId(Long personaId);
    List<User> findByEstado(EstadoUsuario estado);
};
