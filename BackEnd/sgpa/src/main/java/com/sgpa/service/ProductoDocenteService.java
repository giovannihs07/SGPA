package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.response.CategoriaSchemaResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;

public interface ProductoDocenteService {

    ProductoDocenteResponse crear(ProductoDocenteRequest dto, MultipartFile archivo);
    ProductoDocenteResponse actualizarMiProducto(Long id, ProductoDocenteRequest dto, MultipartFile archivo);
    void eliminar(Long id);
    List<ProductoDocenteResponse> buscarTodos();
    ProductoDocenteResponse buscarPorId(Long id);
    List<ProductoDocenteResponse> buscarPorTipo(Long tipoProductoId);
    List<ProductoDocenteResponse> buscarPorDocente(Long docenteId);
    List<ProductoDocenteResponse> buscarMisProductos();
    ProductoDocenteResponse buscarMiProductoPorId(Long id);
    List<ProductoDocenteResponse> buscarPublicados();
    ProductoDocenteResponse publicar(Long id);
    ProductoDocenteResponse publicarConAcceso(Long id, Boolean libreAcceso);
    ProductoDocenteResponse despublicar(Long id);
    Page<ProductoDocenteResponse> buscarPorDocentePaginado(Long docenteId, Pageable pageable);
    ProductoOpcionesResponse obtenerOpcionesDisponibles();
    List<CategoriaSchemaResponse> obtenerSchema();
}
