package com.sgpa.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.sgpa.dto.request.ProductoArchivoMetaRequest;
import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.request.PublicarProductoRequest;
import com.sgpa.dto.response.CategoriaSchemaResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;
import com.sgpa.dto.response.ProductoPublicoPageResponse;
import com.sgpa.dto.response.ProductoPublicoResumenResponse;
import com.sgpa.exception.AccesoDenegadoException;
import com.sgpa.model.products.ProductoArchivo;
import com.sgpa.model.products.RolArchivoProducto;
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
            @PathVariable Long archivoId,
            @RequestParam(defaultValue = "attachment") String disposition) {
        ProductoArchivo archivo = service.validarDescargaPropietario(id, archivoId);
        Resource resource = fileStorageService.cargarArchivo(archivo.getNombreInterno());
        return respuestaArchivo(resource, archivo.getNombreOriginal(), disposition);
    }

    // Portal público — catálogo publicado con filtros y paginación
    @GetMapping("/publicos")
    public ResponseEntity<ProductoPublicoPageResponse> buscarPublicosPortal(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String subcategoria,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long facultad,
            @RequestParam(required = false) Long programa,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false, defaultValue = "fechaPublicacionSgpa") String campoFecha,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaPublicacionSgpa,desc") String sort) {
        Pageable pageable = PageRequest.of(page, size, parsearOrden(sort));
        return ResponseEntity.ok(service.buscarPublicadosPortal(
                q, categoria, subcategoria, tipo, facultad, programa, desde, hasta, campoFecha, pageable));
    }

    @GetMapping("/publicos/resumen")
    public ResponseEntity<ProductoPublicoResumenResponse> resumenPublicosPortal() {
        return ResponseEntity.ok(service.resumenPublicosPortal());
    }

    @GetMapping("/publicos/{id:\\d+}")
    public ResponseEntity<ProductoDocenteResponse> buscarPublicoPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPublicoPorId(id));
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

        return ResponseEntity.ok(service.buscarTodos());
    }

    // Publicar un producto docente con visibilidad por archivo
    @PatchMapping("/{id}/publicar")
    public ResponseEntity<ProductoDocenteResponse> publicar(
            @PathVariable Long id,
            @RequestBody(required = false) @Valid PublicarProductoRequest request) {
        return ResponseEntity.ok(service.publicar(id, request));
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
            @PathVariable Long id,
            @RequestParam(defaultValue = "attachment") String disposition) {
        try {
            ProductoArchivo principal = service.validarDescargaPublicaPrincipal(id);
            Resource resource = fileStorageService.cargarArchivo(principal.getNombreInterno());
            return respuestaArchivo(resource, principal.getNombreOriginal(), disposition);
        } catch (AccesoDenegadoException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    // Descargar un archivo del producto docente
    @GetMapping("/{id}/archivos/{archivoId}")
    public ResponseEntity<Resource> descargarArchivo(
            @PathVariable Long id,
            @PathVariable Long archivoId,
            @RequestParam(defaultValue = "attachment") String disposition) {
        try {
            ProductoArchivo archivo = service.validarDescargaPublica(id, archivoId);
            Resource resource = fileStorageService.cargarArchivo(archivo.getNombreInterno());
            return respuestaArchivo(resource, archivo.getNombreOriginal(), disposition);
        } catch (AccesoDenegadoException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
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

    private ResponseEntity<Resource> respuestaArchivo(
            Resource resource,
            String nombreOriginal,
            String disposition) {
        boolean inline = "inline".equalsIgnoreCase(disposition);
        String filename = nombreOriginal != null
                ? nombreOriginal.replace("\"", "")
                : "archivo";
        String dispositionType = inline ? "inline" : "attachment";
        return ResponseEntity.ok()
            .contentType(resolverMediaType(nombreOriginal))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                dispositionType + "; filename=\"" + filename + "\"")
            .body(resource);
    }

    private MediaType resolverMediaType(String nombreOriginal) {
        String ext = extensionArchivo(nombreOriginal);
        return switch (ext) {
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "doc" -> MediaType.parseMediaType("application/msword");
            case "docx" -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            case "xls" -> MediaType.parseMediaType("application/vnd.ms-excel");
            case "xlsx" -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case "ppt" -> MediaType.parseMediaType("application/vnd.ms-powerpoint");
            case "pptx" -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation");
            case "zip" -> MediaType.parseMediaType("application/zip");
            case "rar" -> MediaType.parseMediaType("application/vnd.rar");
            case "7z" -> MediaType.parseMediaType("application/x-7z-compressed");
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    private String extensionArchivo(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) {
            return "";
        }
        return nombreOriginal.substring(nombreOriginal.lastIndexOf('.') + 1).toLowerCase();
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

    private Sort parsearOrden(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "fechaPublicacionSgpa");
        }
        String[] partes = sort.split(",", 2);
        String campo = partes[0].trim();
        if (!"fechaPublicacionSgpa".equals(campo) && !"fechaRegistroSgpa".equals(campo)
                && !"nombre".equals(campo)) {
            campo = "fechaPublicacionSgpa";
        }
        Sort.Direction direccion = partes.length > 1
                && "asc".equalsIgnoreCase(partes[1].trim())
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        return Sort.by(direccion, campo);
    }
}
