package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.request.TipoProductoRequest;
import com.sgpa.dto.response.TipoProductoAtributoResponse;
import com.sgpa.dto.response.TipoProductoResponse;

public interface TipoProductoService {
    List<TipoProductoResponse> listarPorSubcategoria(Long subcategoriaId, boolean soloActivos);
    List<TipoProductoResponse> listarTodos();
    TipoProductoResponse buscarPorId(Long id);
    List<TipoProductoAtributoResponse> listarAtributos(Long tipoProductoId);
    TipoProductoResponse crear(TipoProductoRequest dto);
    TipoProductoResponse actualizar(Long id, TipoProductoRequest dto);
    void activar(Long id);
    void desactivar(Long id);
    void eliminar(Long id);
}
