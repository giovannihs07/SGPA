package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.response.DocenteResponse;

public interface DocenteService {
    
    DocenteResponse crear(DocenteRequest request);
    
    DocenteResponse actualizar(Long id, DocenteRequest request);
    
    void eliminar(Long id);
    
    DocenteResponse buscarPorId(Long id);
    
    List<DocenteResponse> buscarTodos();
    
    Page<DocenteResponse> buscarTodosPaginado(Pageable pageable);
    
    List<DocenteResponse> buscarPorNombre(String nombre);
    
    List<DocenteResponse> buscarPorApellido(String apellido);
    
    List<DocenteResponse> buscarPorPrograma(Long programaId);
    
    List<DocenteResponse> buscarPorTitulo(String titulo);
    
    List<DocenteResponse> buscarPorTipoContrato(String tipoContrato);
}
