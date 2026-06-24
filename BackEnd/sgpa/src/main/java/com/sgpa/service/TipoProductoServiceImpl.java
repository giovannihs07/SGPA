package com.sgpa.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.TipoProductoAtributoRequest;
import com.sgpa.dto.request.TipoProductoRequest;
import com.sgpa.dto.response.TipoProductoAtributoResponse;
import com.sgpa.dto.response.TipoProductoResponse;
import com.sgpa.mapper.TipoProductoMapper;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.products.TipoProductoAtributo;
import com.sgpa.repository.SubcategoriaProductoRepository;
import com.sgpa.repository.TipoProductoAtributoRepository;
import com.sgpa.repository.TipoProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class TipoProductoServiceImpl implements TipoProductoService {

    private final TipoProductoRepository tipoProductoRepository;
    private final TipoProductoAtributoRepository atributoRepository;
    private final SubcategoriaProductoRepository subcategoriaRepository;
    private final TipoProductoMapper mapper;
    private final TaxonomiaMetadataEnricher metadataEnricher;
    private final TaxonomiaEliminacionHelper eliminacionHelper;

    @Override
    @Transactional(readOnly = true)
    public List<TipoProductoResponse> listarPorSubcategoria(Long subcategoriaId, boolean soloActivos) {
        List<TipoProducto> tipos = soloActivos
            ? tipoProductoRepository.findBySubcategoriaIdAndActivoTrue(subcategoriaId)
            : tipoProductoRepository.findBySubcategoriaId(subcategoriaId);
        return tipos.stream()
            .map(mapper::toDTO)
            .map(metadataEnricher::enrich)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoProductoResponse> listarTodos() {
        return tipoProductoRepository.findAll().stream()
            .map(mapper::toDTO)
            .map(metadataEnricher::enrich)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TipoProductoResponse buscarPorId(Long id) {
        return metadataEnricher.enrich(mapper.toDTO(
            tipoProductoRepository.findByIdWithAtributos(id)
                .orElseThrow(() -> new RuntimeException(
                    "Tipo de producto no encontrado con id: " + id))));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoProductoAtributoResponse> listarAtributos(Long tipoProductoId) {
        buscarEntidad(tipoProductoId); // valida que existe
        return atributoRepository
            .findByTipoProductoIdOrderByOrden(tipoProductoId)
            .stream()
            .map(mapper::toAtributoDTO)
            .toList();
    }

    @Override
    @Transactional
    public TipoProductoResponse crear(TipoProductoRequest dto) {
        SubcategoriaProducto subcategoria = subcategoriaRepository
            .findById(dto.getSubcategoriaId())
            .orElseThrow(() -> new RuntimeException(
                "Subcategoría no encontrada con id: "
                + dto.getSubcategoriaId()));

        if (tipoProductoRepository.existsByNombreAndSubcategoriaId(
                dto.getNombre(), dto.getSubcategoriaId()))
            throw new IllegalStateException(
                "Ya existe un tipo con ese nombre en esta subcategoría");

        TipoProducto tipo = new TipoProducto();
        tipo.setNombre(dto.getNombre());
        tipo.setSubcategoria(subcategoria);
        tipo.setActivo(true);
        tipo = tipoProductoRepository.save(tipo);

        // Guarda los atributos asociados
        guardarAtributos(tipo, dto.getAtributos());

        return metadataEnricher.enrich(mapper.toDTO(
            tipoProductoRepository.findByIdWithAtributos(tipo.getId())
                .orElseThrow()));
    }

    @Override
    @Transactional
    public TipoProductoResponse actualizar(Long id, TipoProductoRequest dto) {
        TipoProducto tipo = buscarEntidad(id);

        SubcategoriaProducto subcategoria = subcategoriaRepository
            .findById(dto.getSubcategoriaId())
            .orElseThrow(() -> new RuntimeException(
                "Subcategoría no encontrada con id: "
                + dto.getSubcategoriaId()));

        boolean nombreCambio = !tipo.getNombre().equals(dto.getNombre());
        boolean subcategoriaCambio = !tipo.getSubcategoria()
            .getId().equals(dto.getSubcategoriaId());

        if ((nombreCambio || subcategoriaCambio) && tipoProductoRepository.existsByNombreAndSubcategoriaId(
                    dto.getNombre(), dto.getSubcategoriaId()))
            throw new IllegalStateException(
                "Ya existe un tipo con ese nombre en esta subcategoría");

        tipo.setNombre(dto.getNombre());
        tipo.setSubcategoria(subcategoria);
        tipoProductoRepository.save(tipo);

        // Reemplaza todos los atributos
        atributoRepository.deleteByTipoProductoId(id);
        guardarAtributos(tipo, dto.getAtributos());

        return metadataEnricher.enrich(
            mapper.toDTO(tipoProductoRepository.findByIdWithAtributos(id).orElseThrow()));
    }

    @Override
    @Transactional
    public void activar(Long id) {
        TipoProducto tipo = buscarEntidad(id);
        tipo.setActivo(true);
        tipoProductoRepository.save(tipo);
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        TipoProducto tipo = buscarEntidad(id);
        tipo.setActivo(false);
        tipoProductoRepository.save(tipo);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        TipoProducto tipo = buscarEntidad(id);
        validarTaxonomiaInactivaParaEliminar(tipo.getActivo(), "tipos de producto");
        eliminacionHelper.eliminarTipo(id);
    }

    private void validarTaxonomiaInactivaParaEliminar(Boolean activo, String etiqueta) {
        if (Boolean.TRUE.equals(activo)) {
            throw new IllegalStateException(
                    "Solo se pueden eliminar " + etiqueta + " desactivados. Desactívalo primero.");
        }
    }

    private void guardarAtributos(TipoProducto tipo, List<TipoProductoAtributoRequest> dtos) {
        List<TipoProductoAtributo> atributos = dtos.stream()
            .map(dto -> {
                TipoProductoAtributo atributo = new TipoProductoAtributo();
                atributo.setNombreAtributo(dto.getNombreAtributo());
                atributo.setEtiqueta(dto.getEtiqueta());
                atributo.setTipoDato(dto.getTipoDato());
                atributo.setRequerido(dto.getRequerido() != null ? dto.getRequerido() : true);
                atributo.setOrden(dto.getOrden());
                atributo.setOpciones(dto.getOpciones());
                atributo.setTipoProducto(tipo);
                return atributo;
            })
            .toList();
        atributoRepository.saveAll(atributos);
    }

    private TipoProducto buscarEntidad(Long id) {
        return tipoProductoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Tipo de producto no encontrado con id: " + id));
    }
}
