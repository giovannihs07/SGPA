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
    public InstitucionResponse crear(InstitucionRequest request) {
        Institucion institucion = mapper.toEntity(request);
        return mapper.toResponse(repository.save(institucion));
    }

    @Override
    @Transactional
    public InstitucionResponse actualizar(Long id, InstitucionRequest request) {
        Institucion institucion = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        
        institucion.setNombre(request.getNombre());
        institucion.setNit(request.getNit());
        institucion.setCiudad(request.getCiudad());
        institucion.setPais(request.getPais());
        
        return mapper.toResponse(repository.save(institucion));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new ProductoDocenteNotFoundException(id);
        repository.deleteById(id);
    }

    @Override
    public InstitucionResponse buscarPorId(Long id) {
        Institucion institucion = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        return mapper.toResponse(institucion);
    }

    @Override
    public List<InstitucionResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public Page<InstitucionResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable)
            .map(mapper::toResponse);
    }

    @Override
    public List<InstitucionResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    public List<InstitucionResponse> buscarPorNit(String nit) {
        return mapper.toResponseList(repository.findByNit(nit));
    }

    @Override
    public List<InstitucionResponse> buscarPorCiudad(String ciudad) {
        return mapper.toResponseList(repository.findByCiudad(ciudad));
    }

    @Override
    public List<InstitucionResponse> buscarPorPais(String pais) {
        return mapper.toResponseList(repository.findByPais(pais));
    }
}
