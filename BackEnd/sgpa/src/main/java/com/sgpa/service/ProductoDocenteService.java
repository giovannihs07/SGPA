package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.response.ProductoDocenteResponse;

public interface ProductoDocenteService {

    ProductoDocenteResponse crear(ProductoDocenteRequest dto, MultipartFile archivo);
    ProductoDocenteResponse buscarPorId(Long id);
    List<ProductoDocenteResponse> buscarTodos();
    List<ProductoDocenteResponse> buscarPorTipo(String tipo);
    List<ProductoDocenteResponse> buscarPorDocente(Long docenteId);
    List<ProductoDocenteResponse> buscarPublicados();
    Page<ProductoDocenteResponse> buscarPorDocentePaginado(Long docenteId, Pageable pageable);
    ProductoDocenteResponse actualizar(Long id, ProductoDocenteRequest dto);
    ProductoDocenteResponse publicar(Long id);
    ProductoDocenteResponse despublicar(Long id);
    void eliminar(Long id);
}
