package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;

public interface FacultadService {
    
    FacultadResponse crear(FacultadRequest dto);
    FacultadResponse buscarPorId(Long id);
    List<FacultadResponse> listarTodas();
    List<FacultadResponse> listarPorInstitucion(Long institucionId);
    FacultadResponse actualizar(Long id, FacultadRequest dto);
    void eliminar(Long id);
}
