package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.UserRequest;
import com.sgpa.dto.response.UserResponse;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        List<String> roles = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toList());
        return new UserResponse(user.getId(), user.getEmail(), roles);
    }

    public List<UserResponse> toResponseList(List<User> users) {
        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public User toEntity(UserRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        return user;
    }
}
