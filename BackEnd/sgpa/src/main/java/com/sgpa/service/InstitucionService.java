package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sgpa.dto.request.InstitucionRequest;
import com.sgpa.dto.response.InstitucionResponse;

public interface InstitucionService {
    
    InstitucionResponse crear(InstitucionRequest dto);
    InstitucionResponse buscarPorId(Long id);
    List<InstitucionResponse> listarTodas();
    InstitucionResponse actualizar(Long id, InstitucionRequest dto);
    void eliminar(Long id);
}
