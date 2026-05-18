package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.response.RoleResponse;

public interface RoleService {

    List<RoleResponse> findAll();
}
