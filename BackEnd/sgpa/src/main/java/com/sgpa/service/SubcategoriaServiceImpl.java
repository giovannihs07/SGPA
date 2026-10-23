package com.sgpa.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.SubcategoriaRequest;
import com.sgpa.dto.response.SubcategoriaResponse;
import com.sgpa.mapper.SubcategoriaMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.repository.CategoriaProductoRepository;
import com.sgpa.repository.SubcategoriaProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SubcategoriaServiceImpl implements SubcategoriaService {

    private final SubcategoriaProductoRepository repository;
    private final CategoriaProductoRepository categoriaRepository;
    private final SubcategoriaMapper mapper;
    private final TaxonomiaMetadataEnricher metadataEnricher;
    private final TaxonomiaEliminacionHelper eliminacionHelper;
    private final AuditService auditService;

    @Override
    @Transactional(readOnly = true)
    public List<SubcategoriaResponse> listarPorCategoria(Long categoriaId, boolean soloActivas) {
        List<SubcategoriaProducto> subs = soloActivas
            ? repository.findByCategoriaIdAndActivoTrue(categoriaId)
            : repository.findByCategoriaId(categoriaId);
        return subs.stream()
            .map(mapper::toDTO)
            .map(metadataEnricher::enrich)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubcategoriaResponse> listarTodas() {
        return repository.findAll().stream()
            .map(mapper::toDTO)
            .map(metadataEnricher::enrich)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SubcategoriaResponse buscarPorId(Long id) {
        return metadataEnricher.enrich(mapper.toDTO(buscarEntidad(id)));
    }

    @Override
    @Transactional
    public SubcategoriaResponse crear(SubcategoriaRequest dto) {
        CategoriaProducto categoria = categoriaRepository
            .findById(dto.getCategoriaId())
            .orElseThrow(() -> new RuntimeException(
                "Categoría no encontrada con id: " + dto.getCategoriaId()));

        if (repository.existsByNombreAndCategoriaId(
                dto.getNombre(), dto.getCategoriaId()))
            throw new IllegalStateException(
                "Ya existe una subcategoría con ese nombre en esta categoría");

        SubcategoriaProducto subcategoria = new SubcategoriaProducto();
        subcategoria.setNombre(dto.getNombre());
        subcategoria.setCategoria(categoria);
        subcategoria.setActivo(true);
        SubcategoriaProducto guardada = repository.save(subcategoria);
        auditar("CREAR_SUBCATEGORIA", "Creó la subcategoría \"" + guardada.getNombre() + "\"",
                guardada, ResultadoAuditoria.EXITOSO);
        return metadataEnricher.enrich(mapper.toDTO(guardada));
    }

    @Override
    @Transactional
    public SubcategoriaResponse actualizar(Long id, SubcategoriaRequest dto) {
        SubcategoriaProducto subcategoria = buscarEntidad(id);

        CategoriaProducto categoria = categoriaRepository
            .findById(dto.getCategoriaId())
            .orElseThrow(() -> new RuntimeException(
                "Categoría no encontrada con id: " + dto.getCategoriaId()));

        boolean nombreCambio = !subcategoria.getNombre()
            .equals(dto.getNombre());
        boolean categoriaCambio = !subcategoria.getCategoria()
            .getId().equals(dto.getCategoriaId());

        if ((nombreCambio || categoriaCambio) && repository.existsByNombreAndCategoriaId(
                    dto.getNombre(), dto.getCategoriaId()))
            throw new IllegalStateException(
                "Ya existe una subcategoría con ese nombre en esta categoría");

        subcategoria.setNombre(dto.getNombre());
        subcategoria.setCategoria(categoria);
        SubcategoriaProducto guardada = repository.save(subcategoria);
        auditar("EDITAR_SUBCATEGORIA", "Editó la subcategoría \"" + guardada.getNombre() + "\"",
                guardada, ResultadoAuditoria.EXITOSO);
        return metadataEnricher.enrich(mapper.toDTO(guardada));
    }

    @Override
    @Transactional
    public void activar(Long id) {
        SubcategoriaProducto sub = buscarEntidad(id);
        sub.setActivo(true);
        repository.save(sub);
        auditar("ACTIVAR_SUBCATEGORIA", "Activó la subcategoría \"" + sub.getNombre() + "\"",
                sub, ResultadoAuditoria.EXITOSO);
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        SubcategoriaProducto sub = buscarEntidad(id);
        sub.setActivo(false);
        repository.save(sub);
        auditar("DESACTIVAR_SUBCATEGORIA", "Desactivó la subcategoría \"" + sub.getNombre() + "\"",
                sub, ResultadoAuditoria.CRITICO);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        SubcategoriaProducto sub = buscarEntidad(id);
        validarTaxonomiaInactivaParaEliminar(sub.getActivo(), "subcategorías");
        eliminacionHelper.eliminarSubcategoria(id);
        auditar("ELIMINAR_SUBCATEGORIA", "Eliminó la subcategoría \"" + sub.getNombre() + "\"",
                sub, ResultadoAuditoria.CRITICO);
    }

    private void auditar(String accion, String descripcion,
            SubcategoriaProducto sub, ResultadoAuditoria resultado) {
        auditService.registrar(ModuloAuditoria.CONFIGURACION, accion, descripcion,
                "SubcategoriaProducto", sub.getId(), sub.getNombre(), null, resultado);
    }

    private void validarTaxonomiaInactivaParaEliminar(Boolean activo, String etiqueta) {
        if (Boolean.TRUE.equals(activo)) {
            throw new IllegalStateException(
                    "Solo se pueden eliminar " + etiqueta + " desactivadas. Desactívala primero.");
        }
    }

    private SubcategoriaProducto buscarEntidad(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Subcategoría no encontrada con id: " + id));
    }
}
