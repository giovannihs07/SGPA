package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoDocenteRequestDTO;
import com.sgpa.dto.response.ProductoDocenteResponseDTO;

// service/ProductoDocenteService.java
public interface ProductoDocenteService {

    ProductoDocenteResponseDTO crear(ProductoDocenteRequestDTO dto, MultipartFile archivo);
    ProductoDocenteResponseDTO actualizar(Long id, ProductoDocenteRequestDTO dto);
    List<ProductoDocenteResponseDTO> buscarTodos();
    void eliminar(Long id);
    ProductoDocenteResponseDTO buscarPorId(Long id);
    Page<ProductoDocenteResponseDTO> buscarTodosPaginado(Pageable pageable);
    List<ProductoDocenteResponseDTO> buscarPorCategoria(String categoria);
    List<ProductoDocenteResponseDTO> buscarPorSubcategoria(String subcategoria);
    List<ProductoDocenteResponseDTO> buscarPorTipo(String tipo);
    List<ProductoDocenteResponseDTO> buscarPorNombre(String nombre);
   
}
