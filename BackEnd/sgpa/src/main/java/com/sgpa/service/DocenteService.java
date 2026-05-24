package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.request.RegistroAdminParaDocenteRequest;
import com.sgpa.dto.request.RegistroDocenteRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.DocenteAdministrativoResponse;
import com.sgpa.dto.response.DocenteResponse;

public interface DocenteService {
    
    DocenteResponse registrar(RegistroDocenteRequest dto);
    DocenteAdministrativoResponse registrarDocenteAdministrativo (RegistroDocenteRequest docenteDto, RegistroAdminParaDocenteRequest adminDto);
    DocenteResponse buscarPorId(Long id);
    DocenteResponse buscarPorEmail(String email);
    List<DocenteResponse> listarTodos();
    List<DocenteResponse> listarPorPrograma(Long programaId);
    DocenteResponse actualizar(Long id, RegistroDocenteRequest dto);
    DocenteResponse agregarTitulo(Long docenteId, TituloAcademicoRequest dto);
    void eliminarTitulo(Long tituloId);
}
