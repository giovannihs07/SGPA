package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.request.CategoriaRequest;
import com.sgpa.dto.response.CategoriaResponse;

public interface CategoriaService {
    List<CategoriaResponse> listarActivas();
    List<CategoriaResponse> listarTodas();
    CategoriaResponse buscarPorId(Long id);
    CategoriaResponse crear(CategoriaRequest dto);
    CategoriaResponse actualizar(Long id, CategoriaRequest dto);
    void activar(Long id);
    void desactivar(Long id);
    void eliminar(Long id);
}
