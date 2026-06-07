package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.request.PublicarProductoRequest;
import com.sgpa.model.products.ProductoArchivo;
import com.sgpa.dto.response.CategoriaSchemaResponse;
import com.sgpa.dto.response.ProductoArchivoResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;

public interface ProductoDocenteService {

    ProductoDocenteResponse crear(ProductoDocenteRequest dto, List<MultipartFile> archivos);
    ProductoDocenteResponse actualizarMiProducto(Long id, ProductoDocenteRequest dto, List<MultipartFile> archivos);
    ProductoArchivoResponse buscarArchivoPorId(Long productoId, Long archivoId);
    ProductoArchivoResponse buscarMiArchivoPorId(Long productoId, Long archivoId);
    void eliminar(Long id);
    List<ProductoDocenteResponse> buscarTodos();
    ProductoDocenteResponse buscarPorId(Long id);
    List<ProductoDocenteResponse> buscarPorTipo(Long tipoProductoId);
    List<ProductoDocenteResponse> buscarPorDocente(Long docenteId);
    List<ProductoDocenteResponse> buscarMisProductos();
    ProductoDocenteResponse buscarMiProductoPorId(Long id);
    List<ProductoDocenteResponse> buscarPublicados();
    ProductoDocenteResponse publicar(Long id, PublicarProductoRequest request);
    ProductoArchivo validarDescargaPropietario(Long productoId, Long archivoId);
    ProductoArchivo validarDescargaPublica(Long productoId, Long archivoId);
    ProductoArchivo validarDescargaPublicaPrincipal(Long productoId);
    ProductoDocenteResponse despublicar(Long id);
    Page<ProductoDocenteResponse> buscarPorDocentePaginado(Long docenteId, Pageable pageable);
    ProductoOpcionesResponse obtenerOpcionesDisponibles();
    List<CategoriaSchemaResponse> obtenerSchema();
}
