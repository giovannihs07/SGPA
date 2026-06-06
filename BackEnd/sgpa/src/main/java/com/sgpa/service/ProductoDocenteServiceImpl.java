package com.sgpa.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.builder.ProductoDocenteBuilder;
import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.response.CategoriaSchemaResponse;
import com.sgpa.dto.response.ProductoArchivoResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.dto.response.ProductoOpcionesResponse;
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

import lombok.RequiredArgsConstructor;

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

    @Override
    @Transactional
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

        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional
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

        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional
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
    public List<ProductoDocenteResponse> buscarTodos() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public ProductoDocenteResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    public List<ProductoDocenteResponse> buscarPorTipo(Long tipoProductoId) {
        return mapper.toDTOList(repository.findByTipoProductoId(tipoProductoId));
    }

    @Override
    public List<ProductoDocenteResponse> buscarPorDocente(Long docenteId) {
        return mapper.toDTOList(repository.findByDocenteId(docenteId));
    }

    @Override
    public List<ProductoDocenteResponse> buscarMisProductos() {
        Docente docente = obtenerDocenteAutenticado();
        return mapper.toDTOList(repository.findByDocenteId(docente.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoDocenteResponse buscarMiProductoPorId(Long id) {
        return mapper.toDTO(buscarEntidadPropia(id));
    }

    @Override
    public List<ProductoDocenteResponse> buscarPublicados() {
        return mapper.toDTOList(repository.findByPublicado(true));
    }

    @Override
    @Transactional
    public ProductoDocenteResponse publicar(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        producto.setPublicado(true);
        producto.setLibreAcceso(false); // por defecto al publicar
        producto.setFechaPublicacion(LocalDate.now());
        ProductoDocente guardado = repository.save(producto);

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "PUBLICAR_PRODUCTO",
                "Publicó el producto \"" + guardado.getNombre() + "\"",
                "ProductoDocente", guardado.getId(), guardado.getNombre(),
                null, ResultadoAuditoria.EXITOSO);

        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional
    public ProductoDocenteResponse publicarConAcceso(Long id, Boolean libreAcceso) {
        ProductoDocente producto = buscarEntidad(id);
        producto.setPublicado(true);
        producto.setLibreAcceso(
                libreAcceso != null ? libreAcceso : false);
        producto.setFechaPublicacion(LocalDate.now());
        ProductoDocente guardado = repository.save(producto);

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "PUBLICAR_PRODUCTO",
                "Publicó el producto \"" + guardado.getNombre() + "\"",
                "ProductoDocente", guardado.getId(), guardado.getNombre(),
                Map.of("libreAcceso", libreAcceso != null ? libreAcceso : false),
                ResultadoAuditoria.EXITOSO);

        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional
    public ProductoDocenteResponse despublicar(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        producto.setPublicado(false);
        producto.setFechaPublicacion(null);
        ProductoDocente guardado = repository.save(producto);

        auditService.registrar(ModuloAuditoria.PRODUCTOS, "DESPUBLICAR_PRODUCTO",
                "Despublicó el producto \"" + guardado.getNombre() + "\"",
                "ProductoDocente", guardado.getId(), guardado.getNombre(),
                null, ResultadoAuditoria.EXITOSO);

        return mapper.toDTO(guardado);
    }

    @Override
    public Page<ProductoDocenteResponse> buscarPorDocentePaginado(Long docenteId, Pageable pageable) {
        return repository.findByDocenteId(docenteId, pageable).map(mapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
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

    public ProductoArchivo obtenerArchivoEntidad(Long productoId, Long archivoId) {
        ProductoDocente producto = buscarEntidad(productoId);
        return buscarArchivoEnProducto(producto, archivoId);
    }

    public ProductoArchivo obtenerArchivoPrincipal(Long productoId) {
        ProductoDocente producto = buscarEntidad(productoId);
        return producto.getArchivos().stream()
                .filter(a -> a.getRol() == RolArchivoProducto.PRINCIPAL)
                .findFirst()
                .orElseThrow(() -> new ArchivoNotFoundException(
                        "Principal del producto " + productoId));
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
}
