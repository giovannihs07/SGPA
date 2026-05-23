package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.InstitucionRequest;
import com.sgpa.dto.response.InstitucionResponse;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.mapper.InstitucionMapper;
import com.sgpa.model.Institucion;
import com.sgpa.repository.InstitucionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstitucionServiceImpl implements InstitucionService {

    private final InstitucionRepository repository;
    private final InstitucionMapper mapper;

    @Override
    @Transactional
    public InstitucionResponse crear(InstitucionRequest dto) {
        if (repository.existsByNit(dto.getNit()))
            throw new IllegalStateException(
                "Ya existe una institución con NIT: " + dto.getNit());

        if (repository.existsByNombre(dto.getNombre()))
            throw new IllegalStateException(
                "Ya existe una institución con nombre: " + dto.getNombre());

        return mapper.toDTO(repository.save(mapper.toEntity(dto)));
    }

    @Override
    public InstitucionResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    public List<InstitucionResponse> listarTodas() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    @Transactional
    public InstitucionResponse actualizar(Long id, InstitucionRequest dto) {
        Institucion institucion = buscarEntidad(id);

        // Verifica que el nuevo NIT no pertenezca a otra institución
        if (!institucion.getNit().equals(dto.getNit())
                && repository.existsByNit(dto.getNit()))
            throw new IllegalStateException(
                "Ya existe una institución con NIT: " + dto.getNit());

        institucion.setNombre(dto.getNombre());
        institucion.setNit(dto.getNit());
        institucion.setCiudad(dto.getCiudad());
        institucion.setPais(dto.getPais());

        return mapper.toDTO(repository.save(institucion));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new RuntimeException(
                "Institución no encontrada con id: " + id);
        repository.deleteById(id);
    }

    private Institucion buscarEntidad(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Institución no encontrada con id: " + id));
    }
}
