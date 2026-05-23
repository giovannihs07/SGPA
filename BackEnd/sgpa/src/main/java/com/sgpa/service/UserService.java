package com.sgpa.service;

import java.util.List;
import java.util.Set;

import com.sgpa.dto.request.ActualizarEmailRequest;
import com.sgpa.dto.response.RoleResponse;
import com.sgpa.dto.response.UserResumenResponse;

public interface UserService {
    List<UserResumenResponse> listarTodos();
    UserResumenResponse buscarPorId(Long id);
    void activar(Long userId);
    void desactivar(Long userId);
    void cambiarRoles(Long userId, Set<String> nuevosRoles);
    UserResumenResponse actualizarEmail(Long userId, ActualizarEmailRequest dto);
    void cambiarPassword(String email, String passwordActual, String passwordNuevo);
}
