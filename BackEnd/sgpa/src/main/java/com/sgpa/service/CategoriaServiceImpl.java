package com.sgpa.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.CategoriaRequest;
import com.sgpa.dto.response.CategoriaResponse;
import com.sgpa.mapper.CategoriaMapper;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.repository.CategoriaProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaProductoRepository repository;
    private final CategoriaMapper mapper;
    private final TaxonomiaMetadataEnricher metadataEnricher;
    private final TaxonomiaEliminacionHelper eliminacionHelper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarActivas() {
        return repository.findByActivoTrue().stream()
            .map(mapper::toDTO)
            .map(metadataEnricher::enrich)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarTodas() {
        return repository.findAll().stream()
            .map(mapper::toDTO)
            .map(metadataEnricher::enrich)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        return metadataEnricher.enrich(mapper.toDTO(buscarEntidad(id)));
    }

    @Override
    @Transactional
    public CategoriaResponse crear(CategoriaRequest dto) {
        if (repository.existsByNombre(dto.getNombre()))
            throw new IllegalStateException(
                "Ya existe una categoría con ese nombre");

        CategoriaProducto categoria = new CategoriaProducto();
        categoria.setNombre(dto.getNombre());
        categoria.setActivo(true);
        return metadataEnricher.enrich(mapper.toDTO(repository.save(categoria)));
    }

    @Override
    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest dto) {
        CategoriaProducto categoria = buscarEntidad(id);

        if (!categoria.getNombre().equals(dto.getNombre())
                && repository.existsByNombre(dto.getNombre()))
            throw new IllegalStateException(
                "Ya existe una categoría con ese nombre");

        categoria.setNombre(dto.getNombre());
        return metadataEnricher.enrich(mapper.toDTO(repository.save(categoria)));
    }

    @Override
    @Transactional
    public void activar(Long id) {
        CategoriaProducto categoria = buscarEntidad(id);
        categoria.setActivo(true);
        repository.save(categoria);
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        CategoriaProducto categoria = buscarEntidad(id);
        categoria.setActivo(false);
        repository.save(categoria);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        CategoriaProducto categoria = buscarEntidad(id);
        validarTaxonomiaInactivaParaEliminar(categoria.getActivo(), "categorías");
        eliminacionHelper.eliminarCategoria(id);
        repository.deleteById(id);
    }

    private void validarTaxonomiaInactivaParaEliminar(Boolean activo, String etiqueta) {
        if (Boolean.TRUE.equals(activo)) {
            throw new IllegalStateException(
                    "Solo se pueden eliminar " + etiqueta + " desactivadas. Desactívala primero.");
        }
    }

    private CategoriaProducto buscarEntidad(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Categoría no encontrada con id: " + id));
    }
}
