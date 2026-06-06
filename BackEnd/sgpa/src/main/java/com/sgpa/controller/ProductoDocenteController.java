package com.sgpa.controller;

import java.util.ArrayList;
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

import com.sgpa.dto.request.ProductoArchivoMetaRequest;
import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.response.CategoriaSchemaResponse;
import com.sgpa.dto.response.ProductoArchivoResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;
import com.sgpa.model.products.ProductoArchivo;
import com.sgpa.model.products.RolArchivoProducto;
import com.sgpa.service.FileStorageService;
import com.sgpa.service.ProductoDocenteService;
import com.sgpa.service.ProductoDocenteServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoDocenteController {

    private final ProductoDocenteService service;
    private final ProductoDocenteServiceImpl serviceImpl;
    private final FileStorageService fileStorageService;

    // Crear un producto docente
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDocenteResponse> crear(
            @RequestPart("datos") @Valid ProductoDocenteRequest dto,
            @RequestPart(value = "archivos", required = false) List<MultipartFile> archivos,
            @RequestPart(value = "archivo", required = false) MultipartFile archivoLegacy) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.crear(dto, normalizarArchivos(archivos, archivoLegacy, dto, true)));
    }

    // Buscar los productos docentes del usuario autenticado
    @GetMapping("/mis")
    public ResponseEntity<List<ProductoDocenteResponse>> misProductos() {
        return ResponseEntity.ok(service.buscarMisProductos());
    }

    // Buscar un producto docente del usuario autenticado
    @GetMapping("/mis/{id}")
    public ResponseEntity<ProductoDocenteResponse> buscarMiProducto(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarMiProductoPorId(id));
    }

    // Actualizar un producto docente del usuario autenticado
    @PutMapping(value = "/mis/{id}",
                consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDocenteResponse> actualizarMiProducto(
            @PathVariable Long id,
            @RequestPart("datos") @Valid ProductoDocenteRequest dto,
            @RequestPart(value = "archivos", required = false) List<MultipartFile> archivos,
            @RequestPart(value = "archivo", required = false) MultipartFile archivoLegacy) {
        return ResponseEntity.ok(
            service.actualizarMiProducto(id, dto,
                normalizarArchivos(archivos, archivoLegacy, dto, false)));
    }

    // Descargar un archivo del producto docente del usuario autenticado
    @GetMapping("/mis/{id}/archivos/{archivoId}")
    public ResponseEntity<Resource> descargarMiArchivo(
            @PathVariable Long id,
            @PathVariable Long archivoId) {
        ProductoArchivoResponse meta = service.buscarMiArchivoPorId(id, archivoId);
        ProductoArchivo archivo = serviceImpl.obtenerArchivoEntidad(id, archivoId);
        Resource resource = fileStorageService.cargarArchivo(archivo.getNombreInterno());
        return respuestaDescarga(resource, meta.getNombreOriginal());
    }

    // Buscar un producto docente por su ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDocenteResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Buscar todos los productos docentes
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

    // Publicar un producto docente
    @PatchMapping("/{id}/publicar")
    public ResponseEntity<ProductoDocenteResponse> publicar(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false")
            Boolean libreAcceso) {
        return ResponseEntity.ok(
            service.publicarConAcceso(id, libreAcceso));
    }

    // Despublicar un producto docente
    @PatchMapping("/{id}/despublicar")
    public ResponseEntity<ProductoDocenteResponse> despublicar(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.despublicar(id));
    }

    // Eliminar un producto docente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /** Descarga el archivo principal (compatibilidad). */
    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargarArchivoPrincipal(
            @PathVariable Long id) {
        ProductoDocenteResponse dto = service.buscarPorId(id);

        if (dto.getArchivos() == null || dto.getArchivos().isEmpty())
            return ResponseEntity.notFound().build();

        if (!Boolean.TRUE.equals(dto.getPublicado())
                || !Boolean.TRUE.equals(dto.getLibreAcceso())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ProductoArchivo principal = serviceImpl.obtenerArchivoPrincipal(id);
        Resource resource = fileStorageService.cargarArchivo(principal.getNombreInterno());
        return respuestaDescarga(resource, principal.getNombreOriginal());
    }

    // Descargar un archivo del producto docente
    @GetMapping("/{id}/archivos/{archivoId}")
    public ResponseEntity<Resource> descargarArchivo(
            @PathVariable Long id,
            @PathVariable Long archivoId) {
        ProductoDocenteResponse dto = service.buscarPorId(id);
        ProductoArchivoResponse meta = service.buscarArchivoPorId(id, archivoId);

        if (!Boolean.TRUE.equals(dto.getPublicado())
                || !Boolean.TRUE.equals(dto.getLibreAcceso())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ProductoArchivo archivo = serviceImpl.obtenerArchivoEntidad(id, archivoId);
        Resource resource = fileStorageService.cargarArchivo(archivo.getNombreInterno());
        return respuestaDescarga(resource, meta.getNombreOriginal());
    }

    // Obtener el schema de los productos docentes
    @GetMapping("/schema")
    public ResponseEntity<List<CategoriaSchemaResponse>> obtenerSchema() {
        return ResponseEntity.ok(service.obtenerSchema());
    }

    // Obtener las opciones disponibles para los productos docentes
    @GetMapping("/opciones")
    public ResponseEntity<ProductoOpcionesResponse> obtenerOpciones() {
        return ResponseEntity.ok(service.obtenerOpcionesDisponibles());
    }

    // Respuesta de descarga de un archivo
    private ResponseEntity<Resource> respuestaDescarga(Resource resource, String nombreOriginal) {
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + nombreOriginal + "\"")
            .body(resource);
    }

    /** Compatibilidad con cliente que envía un solo "archivo". */
    private List<MultipartFile> normalizarArchivos(
            List<MultipartFile> archivos,
            MultipartFile archivoLegacy,
            ProductoDocenteRequest dto,
            boolean esCreacion) {

        List<MultipartFile> lista = new ArrayList<>();
        if (archivos != null) {
            archivos.stream()
                .filter(f -> f != null && !f.isEmpty())
                .forEach(lista::add);
        }
        if (lista.isEmpty() && archivoLegacy != null && !archivoLegacy.isEmpty()) {
            lista.add(archivoLegacy);
            if (dto.getArchivosMeta() == null || dto.getArchivosMeta().isEmpty()) {
                ProductoArchivoMetaRequest meta = new ProductoArchivoMetaRequest();
                meta.setRol(RolArchivoProducto.PRINCIPAL);
                meta.setOrden(1);
                dto.setArchivosMeta(List.of(meta));
            }
        }
        return lista;
    }
}
