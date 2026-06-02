package com.sgpa.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.response.CategoriaSchemaResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;
import com.sgpa.service.CategoriaService;
import com.sgpa.service.FileStorageService;
import com.sgpa.service.ProductoDocenteService;
import com.sgpa.service.TipoProductoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoDocenteController {

    private final ProductoDocenteService service;
    private final FileStorageService fileStorageService;
    private final CategoriaService categoriaService;
    private final TipoProductoService tipoProductoService;

    // Crear producto con archivo opcional
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDocenteResponse> crear(
            @RequestPart("datos") @Valid ProductoDocenteRequest dto,
            @RequestPart(value = "archivo", required = false)
            MultipartFile archivo) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.crear(dto, archivo));
    }

    // Productos del docente autenticado
    @GetMapping("/mis")
    public ResponseEntity<List<ProductoDocenteResponse>> misProductos() {
        return ResponseEntity.ok(service.buscarMisProductos());
    }

    @GetMapping("/mis/{id}")
    public ResponseEntity<ProductoDocenteResponse> buscarMiProducto(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarMiProductoPorId(id));
    }

    @PutMapping(value = "/mis/{id}",
                consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDocenteResponse> actualizarMiProducto(
            @PathVariable Long id,
            @RequestPart("datos") @Valid ProductoDocenteRequest dto,
            @RequestPart(value = "archivo", required = false)
            MultipartFile archivo) {
        return ResponseEntity.ok(
            service.actualizarMiProducto(id, dto, archivo));
    }

    // Buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDocenteResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Buscar con filtros
    @GetMapping
    public ResponseEntity<?> buscarTodos(
            @RequestParam(required = false) Long tipoProductoId,
            @RequestParam(required = false) Long docenteId,
            @RequestParam(required = false) Boolean publicado,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        if (tipoProductoId != null)
            return ResponseEntity.ok(
                service.buscarPorTipo(tipoProductoId));

        if (docenteId != null && page != null) {
            Pageable pageable = PageRequest.of(
                page, size != null ? size : 10);
            return ResponseEntity.ok(
                service.buscarPorDocentePaginado(docenteId, pageable));
        }

        if (docenteId != null)
            return ResponseEntity.ok(service.buscarPorDocente(docenteId));

        if (Boolean.TRUE.equals(publicado))
            return ResponseEntity.ok(service.buscarPublicados());

        return ResponseEntity.ok(service.buscarTodos());
    }

    // Publicar — con opción de libre acceso
    @PatchMapping("/{id}/publicar")
    public ResponseEntity<ProductoDocenteResponse> publicar(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false")
            Boolean libreAcceso) {
        return ResponseEntity.ok(
            service.publicarConAcceso(id, libreAcceso));
    }

    @PatchMapping("/{id}/despublicar")
    public ResponseEntity<ProductoDocenteResponse> despublicar(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.despublicar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Descargar archivo — respeta libreAcceso
    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargarArchivo(
            @PathVariable Long id) {
        ProductoDocenteResponse dto = service.buscarPorId(id);

        if (dto.getNombreArchivo() == null)
            return ResponseEntity.notFound().build();

        // Si no está publicado o no tiene libre acceso, solo el dueño puede
        if (!Boolean.TRUE.equals(dto.getPublicado())
                || !Boolean.TRUE.equals(dto.getLibreAcceso())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Resource archivo = fileStorageService.cargarArchivo(dto.getNombreArchivo());

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\""
                + dto.getNombreArchivoOriginal() + "\"")
            .body(archivo);
    }

    /**
     * Schema completo para el frontend.
     * Retorna categorías → subcategorías → tipos → atributos.
     * El frontend usa esto para construir formularios dinámicos.
     *
     * GET /api/productos/schema
     */
    @GetMapping("/schema")
    public ResponseEntity<List<CategoriaSchemaResponse>> obtenerSchema() {
        return ResponseEntity.ok(service.obtenerSchema());
    }

    /**
     * Opciones resumidas — solo nombres agrupados.
     * Más ligero que /schema, útil para selects en cascada.
     *
     * GET /api/productos/opciones
     */
    @GetMapping("/opciones")
    public ResponseEntity<ProductoOpcionesResponse> obtenerOpciones() {
        return ResponseEntity.ok(service.obtenerOpcionesDisponibles());
    }
}