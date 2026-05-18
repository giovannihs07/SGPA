package com.sgpa.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.response.RoleResponse;
import com.sgpa.mapper.RoleMapper;
import com.sgpa.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository repository;
    private final RoleMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> findAll() {
        return mapper.toResponseList(repository.findAll());
    }
}
