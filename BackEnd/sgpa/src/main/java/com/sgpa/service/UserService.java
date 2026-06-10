package com.sgpa.service;

import java.util.List;
import java.util.Set;

import com.sgpa.dto.request.ActualizarEmailRequest;
import com.sgpa.dto.request.ActualizarPerfilAdministrativoRequest;
import com.sgpa.dto.request.ActualizarPerfilDocenteRequest;
import com.sgpa.dto.request.ActualizarPerfilProgramasRequest;
import com.sgpa.dto.request.ActualizarPerfilRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.UserDetalleResponse;
import com.sgpa.dto.response.UserResumenResponse;

public interface UserService {
    List<UserResumenResponse> listarTodos();
    UserResumenResponse buscarPorId(Long id);
    UserDetalleResponse obtenerPerfil(String email);
    UserDetalleResponse actualizarPerfil(String email, ActualizarPerfilRequest dto);
    UserDetalleResponse actualizarPerfilDocente(String email, ActualizarPerfilDocenteRequest dto);
    UserDetalleResponse actualizarProgramasPerfil(String email, ActualizarPerfilProgramasRequest dto);
    UserDetalleResponse actualizarPerfilAdministrativo(String email, ActualizarPerfilAdministrativoRequest dto);
    UserDetalleResponse agregarTituloPerfil(String email, TituloAcademicoRequest dto);
    UserDetalleResponse eliminarTituloPerfil(String email, Long tituloId);
    void activar(Long userId);
    void desactivar(Long userId);
    void cambiarRoles(Long userId, Set<String> nuevosRoles);
    UserResumenResponse actualizarEmail(Long userId, ActualizarEmailRequest dto);
    void cambiarPassword(String email, String passwordActual, String passwordNuevo);
}
