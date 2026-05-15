package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sgpa.dto.request.ProgramaRequest;
import com.sgpa.dto.response.ProgramaResponse;

public interface ProgramaService {
    
    ProgramaResponse crear(ProgramaRequest request);
    
    ProgramaResponse actualizar(Long id, ProgramaRequest request);
    
    void eliminar(Long id);
    
    ProgramaResponse buscarPorId(Long id);
    
    List<ProgramaResponse> buscarTodos();
    
    Page<ProgramaResponse> buscarTodosPaginado(Pageable pageable);
    
    List<ProgramaResponse> buscarPorNombre(String nombre);
    
    List<ProgramaResponse> buscarPorFacultad(Long facultadId);
    
    List<ProgramaResponse> buscarPorNivel(String nivel);
    
    List<ProgramaResponse> buscarPorCodigo(String codigo);
}
