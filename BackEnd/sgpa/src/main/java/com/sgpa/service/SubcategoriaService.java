package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.request.SubcategoriaRequest;
import com.sgpa.dto.response.SubcategoriaResponse;

public interface SubcategoriaService {
    List<SubcategoriaResponse> listarPorCategoria(Long categoriaId, boolean soloActivas);
    List<SubcategoriaResponse> listarTodas();
    SubcategoriaResponse buscarPorId(Long id);
    SubcategoriaResponse crear(SubcategoriaRequest dto);
    SubcategoriaResponse actualizar(Long id, SubcategoriaRequest dto);
    void activar(Long id);
    void desactivar(Long id);
    void eliminar(Long id);
}
