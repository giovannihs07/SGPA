package com.proyectogrado.sgpa.controller;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyectogrado.sgpa.dto.ProductoDocenteRequestDTO;
import com.proyectogrado.sgpa.dto.ProductoDocenteResponseDTO;
import com.proyectogrado.sgpa.exception.ProductoDocenteNotFoundException;
import com.proyectogrado.sgpa.model.ProductoDocente;
import com.proyectogrado.sgpa.repository.ProductoDocenteRepository;
import com.proyectogrado.sgpa.service.FileStorageService;
import com.proyectogrado.sgpa.service.ProductoDocenteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// controller/ProductoDocenteController.java
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoDocenteController {

    private final ProductoDocenteService service;
    private final ProductoDocenteRepository repository;
    private final FileStorageService fileStorageService;

    // POST /api/productos — archivo opcional
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDocenteResponseDTO> crear(
            @RequestPart("datos") @Valid ProductoDocenteRequestDTO dto,
            @RequestPart(value = "archivo", required = false) MultipartFile archivo // opcional
    ) {
        ProductoDocenteResponseDTO response = service.crear(dto, archivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/productos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDocenteResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // GET /api/productos/{id}/archivo — descarga el archivo
    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargarArchivo(@PathVariable Long id) {
        ProductoDocente producto = repository.findById(id)
                .orElseThrow(() -> new ProductoDocenteNotFoundException(id));

        if (producto.getNombreArchivo() == null)
            return ResponseEntity.notFound().build();

        Resource archivo = fileStorageService.cargarArchivo(producto.getNombreArchivo());
        String contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + producto.getNombreArchivo() + "\"")
                .body(archivo);
    }

    // GET /api/productos
    // GET /api/productos?page=0&size=10&sort=nombre,asc (paginado)
    @GetMapping
    public ResponseEntity<?> buscarTodos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String subcategoria,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        // Filtros específicos tienen prioridad
        if (nombre != null)
            return ResponseEntity.ok(service.buscarPorNombre(nombre));
        if (tipo != null)
            return ResponseEntity.ok(service.buscarPorTipo(tipo));
        if (subcategoria != null)
            return ResponseEntity.ok(service.buscarPorSubcategoria(subcategoria));
        if (categoria != null)
            return ResponseEntity.ok(service.buscarPorCategoria(categoria));

        // Sin filtros: devuelve paginado si se especifica page/size
        if (page != null) {
            Pageable pageable = PageRequest.of(page, size != null ? size : 10);
            return ResponseEntity.ok(service.buscarTodosPaginado(pageable));
        }

        return ResponseEntity.ok(service.buscarTodos());
    }

    // PUT /api/productos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDocenteResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid ProductoDocenteRequestDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    // DELETE /api/productos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}