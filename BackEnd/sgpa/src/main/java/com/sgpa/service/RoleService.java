package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.request.RoleRequest;
import com.sgpa.dto.response.RoleResponse;

public interface RoleService {
    List<RoleResponse> listarTodos();
    RoleResponse buscarPorId(Long id);
    RoleResponse crear(RoleRequest request);
    RoleResponse actualizar(Long id, RoleRequest request);
    void eliminar(Long id);
}
