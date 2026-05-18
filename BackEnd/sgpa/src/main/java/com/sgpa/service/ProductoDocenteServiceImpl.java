package com.sgpa.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.exception.TipoProductoInvalidoException;
import com.sgpa.factory.ProductoDocenteFactory;
import com.sgpa.mapper.ProductoDocenteMapper;
import com.sgpa.model.Docente;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.ProductoDocenteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoDocenteServiceImpl implements ProductoDocenteService {

    private final ProductoDocenteRepository repository;
    private final DocenteRepository docenteRepository;
    private final ProductoDocenteFactory factory;
    private final ProductoDocenteMapper mapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public ProductoDocenteResponse crear(ProductoDocenteRequest dto, MultipartFile archivo) {
        validarTipo(dto.getTipo());

        // El email viene del token JWT que el JwtValidationFilter ya validó y registró en el SecurityContext
        Docente docente = obtenerDocenteAutenticado();

        ProductoDocente producto = factory.crear(dto, docente);
        producto.setDocente(docente);

        if (archivo != null && !archivo.isEmpty()) {
            String[] nombres = fileStorageService.guardarArchivo(
                archivo, dto.getTipo());
            producto.setNombreArchivo(nombres[0]);
            producto.setNombreArchivoOriginal(nombres[1]);
        }

        return mapper.toDTO(repository.save(producto));
    }

    @Override
    public ProductoDocenteResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    public List<ProductoDocenteResponse> buscarTodos() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public List<ProductoDocenteResponse> buscarPorTipo(String tipo) {
        return mapper.toDTOList(repository.findByTipo(parsearTipo(tipo)));
    }

    @Override
    public List<ProductoDocenteResponse> buscarPorDocente(Long docenteId) {
        return mapper.toDTOList(repository.findByDocenteId(docenteId));
    }

    @Override
    public List<ProductoDocenteResponse> buscarPublicados() {
        return mapper.toDTOList(repository.findByPublicado(true));
    }

    @Override
    public Page<ProductoDocenteResponse> buscarPorDocentePaginado(
            Long docenteId, Pageable pageable) {
        return repository.findByDocenteId(docenteId, pageable)
            .map(mapper::toDTO);
    }

    @Override
    @Transactional
    public ProductoDocenteResponse actualizar(Long id,
            ProductoDocenteRequest dto) {
        ProductoDocente producto = buscarEntidad(id);
        validarTipo(dto.getTipo());

        TipoProducto tipo = TipoProducto.valueOf(dto.getTipo());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setTipo(tipo);
        producto.setAtributos(dto.getAtributos());
        producto.validarAtributos();

        return mapper.toDTO(repository.save(producto));
    }

    @Override
    @Transactional
    public ProductoDocenteResponse publicar(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        producto.setPublicado(true);
        producto.setFechaPublicacion(LocalDate.now());
        return mapper.toDTO(repository.save(producto));
    }

    @Override
    @Transactional
    public ProductoDocenteResponse despublicar(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        producto.setPublicado(false);
        producto.setFechaPublicacion(null);
        return mapper.toDTO(repository.save(producto));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        ProductoDocente producto = buscarEntidad(id);
        if (producto.getNombreArchivo() != null)
            fileStorageService.eliminarArchivo(producto.getNombreArchivo());
        repository.delete(producto);
    }

    // --- Helpers privados ---

    private ProductoDocente buscarEntidad(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Producto no encontrado con id: " + id));
    }

    private Docente obtenerDocenteAutenticado() {
        String email = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();

        return docenteRepository.findByUserEmail(email)
            .orElseThrow(() -> new IllegalStateException(
                "El usuario autenticado no tiene perfil de docente"));
    }

    private void validarTipo(String tipo) {
        try {
            TipoProducto.valueOf(tipo);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Tipo de producto no válido: " + tipo);
        }
    }

    private TipoProducto parsearTipo(String tipo) {
        try {
            return TipoProducto.valueOf(tipo.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tipo no válido: " + tipo);
        }
    }
}
