package com.sgpa.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.builder.ProductoDocenteBuilder;
import com.sgpa.dto.request.ArchivoVisibilidadRequest;
import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.request.PublicarProductoRequest;
import com.sgpa.dto.response.CategoriaSchemaResponse;
import com.sgpa.dto.response.ProductoArchivoResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;
import com.sgpa.dto.response.ProductoPublicoCategoriaCountResponse;
import com.sgpa.dto.response.ProductoPublicoPageResponse;
import com.sgpa.dto.response.ProductoPublicoResumenResponse;
import com.sgpa.dto.response.SubcategoriaSchemaResponse;
import com.sgpa.dto.response.TipoProductoAtributoResponse;
import com.sgpa.dto.response.TipoProductoSchemaResponse;
import com.sgpa.exception.AccesoDenegadoException;
import com.sgpa.exception.ArchivoNotFoundException;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.exception.ProductoNoEditableException;
import com.sgpa.exception.ProductoNoEliminableException;
import com.sgpa.mapper.ProductoArchivoMapper;
import com.sgpa.mapper.ProductoDocenteMapper;
import com.sgpa.mapper.TipoProductoMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.ProductoArchivo;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.RolArchivoProducto;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.users.Docente;
import com.sgpa.repository.CategoriaProductoRepository;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.ProductoDocenteRepository;
import com.sgpa.repository.SubcategoriaProductoRepository;
import com.sgpa.repository.TipoProductoRepository;
import com.sgpa.repository.spec.ProductoPublicoSpecifications;

import lombok.RequiredArgsConstructor;

// Servicio de gestión de productos docentes
// Implementa la interfaz ProductoDocenteService
// PreAuthorize: Verifica que el usuario tenga permisos para realizar la acción
@Service
@RequiredArgsConstructor
public class ProductoDocenteServiceImpl implements ProductoDocenteService {

    private final ProductoDocenteRepository repository;
    private final DocenteRepository docenteRepository;
    private final ProductoDocenteMapper mapper;
    private final TipoProductoMapper tipoProductoMapper;
    private final AuditService auditService;
    private final TipoProductoRepository tipoProductoRepository;
    private final CategoriaProductoRepository categoriaRepository;
    private final SubcategoriaProductoRepository subcategoriaRepository;
    private final ProductoArchivoHelper archivoHelper;
    private final ProductoArchivoMapper archivoMapper;
    private final ProductoAccesoService accesoService;

    @Override
    @Transactional
    @PreAuthorize("hasRole('DOCENTE')") // Verifica que el usuario tenga el rol de DOCENTE
    public ProductoDocenteResponse crear(ProductoDocenteRequest dto, List<MultipartFile> archivos) {

        Docente docente = obtenerDocenteAutenticado();

        // Carga el TipoProducto con sus atributos desde la BD
        TipoProducto tipo = tipoProductoRepository
                .findByIdWithAtributos(dto.getTipoProductoId())
                .orElseThrow(() -> new RuntimeException(
                        "Tipo de producto no encontrado: " + dto.getTipoProductoId()));

        if (!tipo.getActivo())
            throw new IllegalStateException(
                    "El tipo de producto no está activo");

        // Builder construye y valida atributos requeridos
        ProductoDocente producto = ProductoDocenteBuilder.nuevo()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .tipoProducto(tipo)
                .atributos(dto.getAtributos())
                .docente(docente)
                .build();

        archivoHelper.aplicarEnCreacion(producto, tipo, archivos, dto.getArchivosMeta());

        ProductoDocente guardado = repository.save(producto);

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "CREAR_PRODUCTO",
                "Registró el producto \"" + guardado.getNombre() + "\"",
                "ProductoDocente", guardado.getId(), guardado.getNombre(),
                Map.of("tipoProductoId", dto.getTipoProductoId()),
                ResultadoAuditoria.EXITOSO);

        return toDtoConAcceso(guardado, ProductoAccesoService.VisorProducto.PROPIETARIO);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('DOCENTE')") // Verifica que el usuario tenga el rol de DOCENTE
    public ProductoDocenteResponse actualizarMiProducto(Long id, ProductoDocenteRequest dto,
            List<MultipartFile> archivos) {

        ProductoDocente producto = buscarEntidadPropia(id);
        verificarProductoEditable(producto);

        TipoProducto tipo = tipoProductoRepository
                .findByIdWithAtributos(dto.getTipoProductoId())
                .orElseThrow(() -> new RuntimeException(
                        "Tipo de producto no encontrado"));

        if (!tipo.getActivo())
            throw new IllegalStateException(
                    "El tipo de producto no está activo");

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setTipoProducto(tipo);
        producto.setAtributos(dto.getAtributos());
        producto.validarAtributos();

        archivoHelper.aplicarEnActualizacion(
                producto, tipo, dto.getArchivosEliminarIds(), archivos, dto.getArchivosMeta());

        ProductoDocente guardado = repository.save(producto);

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "EDITAR_PRODUCTO",
                "Editó el producto \"" + guardado.getNombre() + "\"",
                "ProductoDocente", guardado.getId(), guardado.getNombre(),
                null, ResultadoAuditoria.EXITOSO);

        return toDtoConAcceso(guardado, ProductoAccesoService.VisorProducto.PROPIETARIO);
    }

    @Override
    @Transactional
    // PreAuthorize: Verifica que el usuario tenga el rol de ADMIN o SUPER_ADMIN o que sea propietario del producto
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN') or @productoSecurity.esPropietario(#id)")
    public void eliminar(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        verificarProductoEliminable(producto);
        String nombre = producto.getNombre();

        archivoHelper.eliminarTodos(producto);

        repository.delete(producto);

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "ELIMINAR_PRODUCTO",
                "Eliminó el producto \"" + nombre + "\"",
                "ProductoDocente", id, nombre,
                null, ResultadoAuditoria.CRITICO);
    }

    @Override
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN', 'SUPER_ADMIN')")
    public List<ProductoDocenteResponse> buscarTodos() {
        return repository.findAll().stream()
                .map(p -> toDtoConAcceso(p, accesoService.resolverVisor(p)))
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN', 'SUPER_ADMIN')")
    public ProductoDocenteResponse buscarPorId(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        return toDtoConAcceso(producto, accesoService.resolverVisor(producto));
    }

    @Override
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN', 'SUPER_ADMIN')")
    public List<ProductoDocenteResponse> buscarPorTipo(Long tipoProductoId) {
        return repository.findByTipoProductoId(tipoProductoId).stream()
                .map(p -> toDtoConAcceso(p, accesoService.resolverVisor(p)))
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN', 'SUPER_ADMIN')")
    public List<ProductoDocenteResponse> buscarPorDocente(Long docenteId) {
        return repository.findByDocenteId(docenteId).stream()
                .map(p -> toDtoConAcceso(p, accesoService.resolverVisor(p)))
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('DOCENTE')")
    public List<ProductoDocenteResponse> buscarMisProductos() {
        Docente docente = obtenerDocenteAutenticado();
        return repository.findByDocenteId(docente.getId()).stream()
                .map(p -> toDtoConAcceso(p, ProductoAccesoService.VisorProducto.PROPIETARIO))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('DOCENTE')")
    public ProductoDocenteResponse buscarMiProductoPorId(Long id) {
        return toDtoConAcceso(buscarEntidadPropia(id), ProductoAccesoService.VisorProducto.PROPIETARIO);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<ProductoDocenteResponse> buscarPublicados() {
        return repository.findByPublicado(true).stream()
                .map(p -> toDtoConAcceso(p, accesoService.resolverVisor(p)))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoPublicoPageResponse buscarPublicadosPortal(
            String q,
            String categoria,
            String subcategoria,
            String tipo,
            Long facultadId,
            Long programaId,
            LocalDate desde,
            LocalDate hasta,
            String campoFecha,
            Pageable pageable) {

        String qNorm = normalizarTexto(q);
        String categoriaNorm = normalizarFiltroTaxonomia(categoria);
        String subcategoriaNorm = normalizarFiltroTaxonomia(subcategoria);
        String tipoNorm = normalizarFiltroTaxonomia(tipo);
        String campoFechaNorm = normalizarCampoFecha(campoFecha);

        Specification<ProductoDocente> spec = ProductoPublicoSpecifications.publicadosConFiltros(
                qNorm, categoriaNorm, subcategoriaNorm, tipoNorm,
                facultadId, programaId, desde, hasta, campoFechaNorm);

        Page<ProductoDocente> page = repository.findAll(spec, pageable);
        List<ProductoDocenteResponse> content = page.getContent().stream()
                .map(p -> toDtoConAcceso(p, ProductoAccesoService.VisorProducto.PUBLICO))
                .toList();

        long ultimos30Dias = repository.count(
                spec.and(ProductoPublicoSpecifications.ultimos30Dias(campoFechaNorm)));

        return ProductoPublicoPageResponse.builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .ultimos30Dias(ultimos30Dias)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    // Resumen de productos públicos del portal (KPIs globales)
    public ProductoPublicoResumenResponse resumenPublicosPortal() {
        String campoFecha = "fechaPublicacionSgpa";
        Specification<ProductoDocente> publicados = ProductoPublicoSpecifications.publicadosConFiltros(
                null, null, null, null, null, null, null, null, campoFecha);

        long total = repository.count(publicados);
        long ultimos30Dias = repository.count(
                publicados.and(ProductoPublicoSpecifications.ultimos30Dias(campoFecha)));

        List<ProductoPublicoCategoriaCountResponse> porCategoria = repository
                .contarPublicadosPorCategoria()
                .stream()
                .map(row -> ProductoPublicoCategoriaCountResponse.builder()
                        .categoria((String) row[0])
                        .count(row[1] instanceof Number n ? n.longValue() : 0L)
                        .build())
                .toList();

        return ProductoPublicoResumenResponse.builder()
                .total(total)
                .ultimos30Dias(ultimos30Dias)
                .porCategoria(porCategoria)
                .build();
    }

    @Override
    public ProductoDocenteResponse buscarPublicoPorId(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        if (!Boolean.TRUE.equals(producto.getPublicado())) {
            throw new ProductoDocenteNotFoundException(id);
        }
        return toDtoConAcceso(producto, ProductoAccesoService.VisorProducto.PUBLICO);
    }

    @Override
    @Transactional
    @PreAuthorize("@productoSecurity.esPropietario(#id)")
    public ProductoDocenteResponse publicar(Long id, PublicarProductoRequest request) {
        ProductoDocente producto = buscarEntidad(id);

        if (producto.getArchivos() == null || producto.getArchivos().isEmpty()) {
            throw new IllegalStateException(
                    "El producto debe tener al menos un archivo antes de publicarse.");
        }

        aplicarVisibilidadArchivos(producto, request);
        producto.setPublicado(true);
        producto.setFechaPublicacionSgpa(LocalDate.now());
        ProductoDocente guardado = repository.save(producto);

        Map<String, Object> detalleVisibilidad = guardado.getArchivos().stream()
                .collect(Collectors.toMap(
                        a -> String.valueOf(a.getId()),
                        a -> Map.of(
                                "nombre", a.getNombreOriginal(),
                                "accesoPublico", a.getAccesoPublico())));

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "PUBLICAR_PRODUCTO",
                "Publicó el producto \"" + guardado.getNombre() + "\"",
                "ProductoDocente", guardado.getId(), guardado.getNombre(),
                Map.of("archivosVisibilidad", detalleVisibilidad),
                ResultadoAuditoria.EXITOSO);

        return toDtoConAcceso(guardado, accesoService.resolverVisor(guardado));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN') or @productoSecurity.esPropietario(#id)")
    public ProductoDocenteResponse despublicar(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        producto.setPublicado(false);
        producto.setFechaPublicacionSgpa(null);
        ProductoDocente guardado = repository.save(producto);

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "DESPUBLICAR_PRODUCTO",
                "Despublicó el producto \"" + guardado.getNombre() + "\"",
                "ProductoDocente", guardado.getId(), guardado.getNombre(),
                null, ResultadoAuditoria.EXITOSO);

        return toDtoConAcceso(guardado, accesoService.resolverVisor(guardado));
    }

    @Override
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN', 'SUPER_ADMIN')")
    public Page<ProductoDocenteResponse> buscarPorDocentePaginado(Long docenteId, Pageable pageable) {
        return repository.findByDocenteId(docenteId, pageable)
                .map(p -> toDtoConAcceso(p, accesoService.resolverVisor(p)));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('DOCENTE')")
    public ProductoArchivo validarDescargaPropietario(Long productoId, Long archivoId) {
        ProductoDocente producto = buscarEntidadPropia(productoId);
        ProductoArchivo archivo = buscarArchivoEnProducto(producto, archivoId);

        if (!Boolean.TRUE.equals(archivo.getAccesoPublico())) {
            auditService.registrar(ModuloAuditoria.PRODUCTOS, "DESCARGA_ARCHIVO_RESTRINGIDO",
                    "Descargó archivo restringido \"" + archivo.getNombreOriginal() + "\"",
                    "ProductoArchivo", archivo.getId(), archivo.getNombreOriginal(),
                    Map.of("productoId", productoId, "productoNombre", producto.getNombre()),
                    ResultadoAuditoria.EXITOSO);
        }

        return archivo;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoArchivo validarDescargaPublica(Long productoId, Long archivoId) {
        ProductoDocente producto = buscarEntidad(productoId);
        ProductoArchivo archivo = buscarArchivoEnProducto(producto, archivoId);
        if (!accesoService.puedeDescargarPublicamente(archivo, producto)) {
            throw new AccesoDenegadoException("No tienes permiso para descargar este archivo");
        }
        return archivo;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoArchivo validarDescargaPublicaPrincipal(Long productoId) {
        ProductoDocente producto = buscarEntidad(productoId);
        ProductoArchivo principal = producto.getArchivos().stream()
                .filter(a -> a.getRol() == RolArchivoProducto.PRINCIPAL)
                .findFirst()
                .orElseThrow(() -> new ArchivoNotFoundException(
                        "Principal del producto " + productoId));
        if (!accesoService.puedeDescargarPublicamente(principal, producto)) {
            throw new AccesoDenegadoException("No tienes permiso para descargar este archivo");
        }
        return principal;
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('DOCENTE')")
    public ProductoOpcionesResponse obtenerOpcionesDisponibles() {
        List<CategoriaProducto> categorias = categoriaRepository.findByActivoTrue();

        Map<String, List<String>> subcategoriasPorCategoria = categorias
                .stream()
                .collect(Collectors.toMap(
                        CategoriaProducto::getNombre,
                        cat -> subcategoriaRepository
                                .findByCategoriaIdAndActivoTrue(cat.getId())
                                .stream()
                                .map(SubcategoriaProducto::getNombre)
                                .toList()));

        Map<String, List<String>> tiposPorSubcategoria = subcategoriaRepository.findAll().stream()
                .filter(SubcategoriaProducto::getActivo)
                .collect(Collectors.toMap(
                        SubcategoriaProducto::getNombre,
                        sub -> tipoProductoRepository
                                .findBySubcategoriaIdAndActivoTrue(sub.getId())
                                .stream()
                                .map(TipoProducto::getNombre)
                                .toList()));

        return ProductoOpcionesResponse.builder()
                .categorias(categorias.stream()
                        .map(CategoriaProducto::getNombre).toList())
                .subcategoriasPorCategoria(subcategoriasPorCategoria)
                .tiposPorSubcategoria(tiposPorSubcategoria)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoArchivoResponse buscarArchivoPorId(Long productoId, Long archivoId) {
        ProductoDocente producto = buscarEntidad(productoId);
        ProductoArchivo archivo = buscarArchivoEnProducto(producto, archivoId);
        return archivoMapper.toDTO(archivo);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('DOCENTE')")
    public ProductoArchivoResponse buscarMiArchivoPorId(Long productoId, Long archivoId) {
        ProductoDocente producto = buscarEntidadPropia(productoId);
        ProductoArchivo archivo = buscarArchivoEnProducto(producto, archivoId);
        return archivoMapper.toDTO(archivo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaSchemaResponse> obtenerSchema() {
        return categoriaRepository.findByActivoTrue().stream()
                .map(this::mapCategoriaToSchema)
                .toList();
    }

    // --- Métodos de mapeo para schema ---

    /**
     * Mapea una categoría a su respuesta schema incluyendo subcategorías y tipos de productos.
     */
    private CategoriaSchemaResponse mapCategoriaToSchema(CategoriaProducto categoria) {
        List<SubcategoriaSchemaResponse> subcategorias = subcategoriaRepository
                .findByCategoriaIdAndActivoTrue(categoria.getId())
                .stream()
                .map(this::mapSubcategoriaToSchema)
                .toList();

        return CategoriaSchemaResponse.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .subcategorias(subcategorias)
                .build();
    }

    /**
     * Mapea una subcategoría a su respuesta schema incluyendo tipos de productos.
     */
    private SubcategoriaSchemaResponse mapSubcategoriaToSchema(SubcategoriaProducto subcategoria) {
        List<TipoProductoSchemaResponse> tipos = tipoProductoRepository
                .findBySubcategoriaIdAndActivoTrue(subcategoria.getId())
                .stream()
                .map(this::mapTipoProductoToSchema)
                .toList();

        return SubcategoriaSchemaResponse.builder()
                .id(subcategoria.getId())
                .nombre(subcategoria.getNombre())
                .tipos(tipos)
                .build();
    }

    /**
     * Mapea un tipo de producto a su respuesta schema incluyendo atributos ordenados.
     */
    private TipoProductoSchemaResponse mapTipoProductoToSchema(TipoProducto tipo) {
        TipoProducto tipoConAtributos = tipoProductoRepository
                .findByIdWithAtributos(tipo.getId())
                .orElse(tipo);

        List<TipoProductoAtributoResponse> atributos = tipoConAtributos.getAtributos()
                .stream()
                .sorted(Comparator.comparing(
                        a -> a.getOrden() != null ? a.getOrden() : 0))
                .map(tipoProductoMapper::toAtributoDTO)
                .toList();

        return TipoProductoSchemaResponse.builder()
                .id(tipoConAtributos.getId())
                .nombre(tipoConAtributos.getNombre())
                .atributos(atributos)
                .build();
    }

    // --- Helpers privados ---

    private ProductoDocenteResponse toDtoConAcceso(
            ProductoDocente entidad,
            ProductoAccesoService.VisorProducto visor) {
        ProductoDocenteResponse dto = mapper.toDTO(entidad);
        return accesoService.aplicarFiltroAcceso(dto, entidad, visor);
    }

    private void aplicarVisibilidadArchivos(
            ProductoDocente producto,
            PublicarProductoRequest request) {

        List<ArchivoVisibilidadRequest> visibilidad = request != null
                ? request.getArchivosVisibilidad()
                : null;

        if (visibilidad == null || visibilidad.isEmpty()) {
            for (ProductoArchivo archivo : producto.getArchivos()) {
                archivo.setAccesoPublico(archivo.getRol() == RolArchivoProducto.PRINCIPAL);
            }
            return;
        }

        if (visibilidad.size() != producto.getArchivos().size()) {
            throw new IllegalArgumentException(
                    "Debe indicar la visibilidad de todos los archivos del producto.");
        }

        for (ArchivoVisibilidadRequest item : visibilidad) {
            ProductoArchivo archivo = producto.getArchivos().stream()
                    .filter(a -> a.getId().equals(item.getArchivoId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Archivo no pertenece al producto: " + item.getArchivoId()));
            archivo.setAccesoPublico(Boolean.TRUE.equals(item.getAccesoPublico()));
        }
    }

    private ProductoDocente buscarEntidad(Long id) {
        return repository.findByIdWithArchivos(id)
                .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
    }

    private ProductoArchivo buscarArchivoEnProducto(ProductoDocente producto, Long archivoId) {
        return producto.getArchivos().stream()
                .filter(a -> a.getId().equals(archivoId))
                .findFirst()
                .orElseThrow(() -> new ArchivoNotFoundException(
                        "Archivo " + archivoId + " del producto " + producto.getId()));
    }

    private ProductoDocente buscarEntidadPropia(Long id) {
        Docente docente = obtenerDocenteAutenticado();
        ProductoDocente producto = buscarEntidad(id);
        if (producto.getDocente() == null
                || !producto.getDocente().getId()
                        .equals(docente.getId())) {
            throw new AccesoDenegadoException(
                    "No tienes permiso para acceder a este producto");
        }
        return producto;
    }

    private void verificarProductoEditable(ProductoDocente producto) {
        if (Boolean.TRUE.equals(producto.getPublicado()))
            throw new ProductoNoEditableException();
    }

    private void verificarProductoEliminable(ProductoDocente producto) {
        if (Boolean.TRUE.equals(producto.getPublicado()))
            throw new ProductoNoEliminableException();
    }

    private Docente obtenerDocenteAutenticado() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return docenteRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "El usuario autenticado no tiene perfil de docente"));
    }

    private String normalizarTexto(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String normalizarFiltroTaxonomia(String value) {
        if (value == null || value.isBlank()
                || "TODAS".equalsIgnoreCase(value)
                || "TODOS".equalsIgnoreCase(value)) {
            return null;
        }
        return value.trim();
    }

    private String normalizarCampoFecha(String campoFecha) {
        if ("fechaRegistroSgpa".equals(campoFecha)) {
            return "fechaRegistroSgpa";
        }
        return "fechaPublicacionSgpa";
    }
}
