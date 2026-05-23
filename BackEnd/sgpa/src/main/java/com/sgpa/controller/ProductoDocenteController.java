package com.sgpa.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.service.FileStorageService;
import com.sgpa.service.ProductoDocenteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoDocenteController {

    private final ProductoDocenteService service;
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDocenteResponse> crear(
            @RequestPart("datos") @Valid ProductoDocenteRequest dto,
            @RequestPart(value = "archivo", required = false) MultipartFile archivo) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.crear(dto, archivo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDocenteResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<?> buscarTodos(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long docenteId,
            @RequestParam(required = false) Boolean publicado,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (tipo != null)
            return ResponseEntity.ok(service.buscarPorTipo(tipo));
        if (docenteId != null && page != null) {
            Pageable pageable = PageRequest.of(page, size != null ? size : 10);
            return ResponseEntity.ok(
                    service.buscarPorDocentePaginado(docenteId, pageable));
        }
        if (docenteId != null)
            return ResponseEntity.ok(service.buscarPorDocente(docenteId));
        if (Boolean.TRUE.equals(publicado))
            return ResponseEntity.ok(service.buscarPublicados());

        return ResponseEntity.ok(service.buscarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDocenteResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid ProductoDocenteRequest dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @PatchMapping("/{id}/publicar")
    public ResponseEntity<ProductoDocenteResponse> publicar(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.publicar(id));
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

    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargarArchivo(@PathVariable Long id) {
        ProductoDocenteResponse dto = service.buscarPorId(id);
        if (dto.getNombreArchivo() == null)
            return ResponseEntity.notFound().build();

        Resource archivo = fileStorageService
                .cargarArchivo(dto.getNombreArchivo());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                dto.getNombreArchivoOriginal() + "\"")
                .body(archivo);
    }

    @GetMapping("/tipos")
    public ResponseEntity<Map<String, Map<String, List<String>>>> listarTipos() {
        Map<String, Map<String, List<String>>> tipos = Arrays.stream(TipoProducto.values())
                .collect(Collectors.groupingBy(
                        t -> t.getSubcategoria().name(),
                        Collectors.toMap(
                                TipoProducto::name,
                                TipoProducto::getAtributosRequeridos)));
        return ResponseEntity.ok(tipos);
    }

    /**
     * Obtiene todas las opciones disponibles para productos.
     * Incluye categorías, subcategorías agrupadas por categoría, 
     * y tipos de productos agrupados por subcategoría.
     */
    @GetMapping("/opciones")
    public ResponseEntity<ProductoOpcionesResponse> obtenerOpcionesDisponibles() {
        return ResponseEntity.ok(service.obtenerOpcionesDisponibles());
    }
}