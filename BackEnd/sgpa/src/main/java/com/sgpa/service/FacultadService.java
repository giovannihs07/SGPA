package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;

public interface FacultadService {
    
    FacultadResponse crear(FacultadRequest request);
    
    FacultadResponse actualizar(Long id, FacultadRequest request);
    
    void eliminar(Long id);
    
    FacultadResponse buscarPorId(Long id);
    
    List<FacultadResponse> buscarTodos();
    
    Page<FacultadResponse> buscarTodosPaginado(Pageable pageable);
    
    List<FacultadResponse> buscarPorNombre(String nombre);
    
    List<FacultadResponse> buscarPorInstitucion(Long institucionId);
}
