package com.proyectogrado.sgpa.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.proyectogrado.sgpa.dto.ProductoDocenteRequestDTO;
import com.proyectogrado.sgpa.dto.ProductoDocenteResponseDTO;
import com.proyectogrado.sgpa.exception.ProductoDocenteNotFoundException;
import com.proyectogrado.sgpa.exception.TipoProductoInvalidoException;
import com.proyectogrado.sgpa.mapper.ProductoDocenteMapper;
import com.proyectogrado.sgpa.model.CategoriaProducto;
import com.proyectogrado.sgpa.model.EstadoProducto;
import com.proyectogrado.sgpa.model.ProductoDocente;
import com.proyectogrado.sgpa.model.ProductoDocenteFactory;
import com.proyectogrado.sgpa.model.SubcategoriaProducto;
import com.proyectogrado.sgpa.model.TipoProducto;
import com.proyectogrado.sgpa.repository.ProductoDocenteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoDocenteServiceImpl implements ProductoDocenteService {

    private final ProductoDocenteRepository repository;
    private final ProductoDocenteFactory factory;
    private final ProductoDocenteMapper mapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public ProductoDocenteResponseDTO crear(ProductoDocenteRequestDTO dto, MultipartFile archivo) {
        validarTipo(dto.getTipo());
        ProductoDocente producto = factory.crear(dto);

        // Archivo es opcional — solo se guarda si viene en el request
        if (archivo != null && !archivo.isEmpty()) {
            String nombreArchivo = fileStorageService.guardarArchivo(archivo, dto.getTipo());
            producto.setNombreArchivo(nombreArchivo);
        }

        return mapper.toDTO(repository.save(producto));
    }

    @Override
    public ProductoDocenteResponseDTO buscarPorId(Long id) {
        ProductoDocente producto = repository.findById(id)
                .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        return mapper.toDTO(producto);
    }

    @Override
    public List<ProductoDocenteResponseDTO> buscarTodos() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public Page<ProductoDocenteResponseDTO> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDTO);
    }

    @Override
    public List<ProductoDocenteResponseDTO> buscarPorCategoria(String categoria) {
        CategoriaProducto categoriaEnum = parsearEnum(
                CategoriaProducto.class, categoria, "categoría");
        return mapper.toDTOList(repository.findByCategoria(categoriaEnum));
    }

    @Override
    public List<ProductoDocenteResponseDTO> buscarPorSubcategoria(String subcategoria) {
        SubcategoriaProducto subcategoriaEnum = parsearEnum(
                SubcategoriaProducto.class, subcategoria, "subcategoría");
        return mapper.toDTOList(repository.findBySubcategoria(subcategoriaEnum));
    }

    @Override
    public List<ProductoDocenteResponseDTO> buscarPorTipo(String tipo) {
        TipoProducto tipoEnum = parsearEnum(TipoProducto.class, tipo, "tipo");
        return mapper.toDTOList(repository.findByTipo(tipoEnum));
    }

    @Override
    public List<ProductoDocenteResponseDTO> buscarPorNombre(String nombre) {
        return mapper.toDTOList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    @Transactional
    public ProductoDocenteResponseDTO actualizar(Long id, ProductoDocenteRequestDTO dto) {
        ProductoDocente existente = repository.findById(id)
                .orElseThrow(() -> new ProductoDocenteNotFoundException(id));

        validarTipo(dto.getTipo());
        TipoProducto tipo = TipoProducto.valueOf(dto.getTipo());

        existente.setNombre(dto.getNombre());
        existente.setDescripcion(dto.getDescripcion());
        existente.setTipo(tipo);
        existente.setSubcategoria(tipo.getSubcategoria());
        existente.setAtributos(dto.getAtributos());

        return mapper.toDTO(repository.save(existente));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new ProductoDocenteNotFoundException(id);
        repository.deleteById(id);
    }

    private void validarTipo(String tipo) {
        try {
            TipoProducto.valueOf(tipo);
        } catch (IllegalArgumentException e) {
            throw new TipoProductoInvalidoException(tipo);
        }
    }

    private <E extends Enum<E>> E parsearEnum(Class<E> clazz, String valor, String campo) {
        try {
            return Enum.valueOf(clazz, valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(
                    "Valor de " + campo + " no válido: " + valor);
        }
    }

    // Métodos que solo RRHH puede invocar
    public ProductoDocenteResponseDTO enviarARevision(Long id) {
        ProductoDocente p = repository.findById(id)
                .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        if (p.getEstado() != EstadoProducto.SIN_PUBLICAR)
            throw new IllegalStateException("Solo productos en SIN_PUBLICAR se pueden enviarse a revisión");
        p.setEstado(EstadoProducto.EN_REVISION);
        return mapper.toDTO(repository.save(p));
    }

    public ProductoDocenteResponseDTO aprobar(Long id) {
        ProductoDocente p = repository.findById(id)
                .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        p.setEstado(EstadoProducto.PUBLICADO);
        p.setFechaPublicacion(LocalDate.now()); // se asigna aquí
        return mapper.toDTO(repository.save(p));
    }

    public ProductoDocenteResponseDTO rechazar(Long id, String observacion) {
        ProductoDocente p = repository.findById(id)
                .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        p.setEstado(EstadoProducto.RECHAZADO);
        return mapper.toDTO(repository.save(p));
    }
}
