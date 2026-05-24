package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.request.ProgramaRequest;
import com.sgpa.dto.response.ProgramaResponse;

public interface ProgramaService {
    
    ProgramaResponse crear(ProgramaRequest dto);
    ProgramaResponse buscarPorId(Long id);
    List<ProgramaResponse> listarTodos();
    List<ProgramaResponse> listarPorFacultad(Long facultadId);
    List<ProgramaResponse> listarPorInstitucion(Long institucionId);
    List<ProgramaResponse> listarPorNivel(String nivel);
    ProgramaResponse actualizar(Long id, ProgramaRequest dto);
    void eliminar(Long id);
}
