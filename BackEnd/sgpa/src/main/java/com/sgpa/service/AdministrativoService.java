package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sgpa.dto.request.AdministrativoRequest;
import com.sgpa.dto.response.AdministrativoResponse;

public interface AdministrativoService {
    
    AdministrativoResponse crear(AdministrativoRequest request);
    
    AdministrativoResponse actualizar(Long id, AdministrativoRequest request);
    
    void eliminar(Long id);
    
    AdministrativoResponse buscarPorId(Long id);
    
    List<AdministrativoResponse> buscarTodos();
    
    Page<AdministrativoResponse> buscarTodosPaginado(Pageable pageable);
    
    List<AdministrativoResponse> buscarPorNombre(String nombre);
    
    List<AdministrativoResponse> buscarPorApellido(String apellido);
    
    List<AdministrativoResponse> buscarPorCargo(String cargo);
    
    List<AdministrativoResponse> buscarPorDependencia(String dependencia);
}
