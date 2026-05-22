package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.request.RegistroAdministrativoRequest;
import com.sgpa.dto.response.AdministrativoResponse;

public interface AdministrativoService {
    AdministrativoResponse registrar(RegistroAdministrativoRequest dto);
    AdministrativoResponse buscarPorId(Long id);
    List<AdministrativoResponse> listarTodos();
    List<AdministrativoResponse> listarPorDependencia(String dependencia);
    AdministrativoResponse actualizar(Long id, RegistroAdministrativoRequest dto);
}
