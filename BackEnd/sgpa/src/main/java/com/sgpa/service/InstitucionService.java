package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sgpa.dto.request.InstitucionRequest;
import com.sgpa.dto.response.InstitucionResponse;

public interface InstitucionService {
    
    InstitucionResponse crear(InstitucionRequest request);
    
    InstitucionResponse actualizar(Long id, InstitucionRequest request);
    
    void eliminar(Long id);
    
    InstitucionResponse buscarPorId(Long id);
    
    List<InstitucionResponse> buscarTodos();
    
    Page<InstitucionResponse> buscarTodosPaginado(Pageable pageable);
    
    List<InstitucionResponse> buscarPorNombre(String nombre);
    
    List<InstitucionResponse> buscarPorNit(String nit);
    
    List<InstitucionResponse> buscarPorCiudad(String ciudad);
    
    List<InstitucionResponse> buscarPorPais(String pais);
}
