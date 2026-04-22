package com.sgpa.backend.repository;

import org.springframework.data.repository.CrudRepository;
import com.sgpa.backend.model.User;

public interface UserRepository extends CrudRepository<User, Long>{
    
};
