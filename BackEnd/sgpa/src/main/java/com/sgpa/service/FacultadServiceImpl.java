package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.mapper.FacultadMapper;
import com.sgpa.model.Facultad;
import com.sgpa.model.Institucion;
import com.sgpa.repository.FacultadRepository;
import com.sgpa.repository.InstitucionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultadServiceImpl implements FacultadService {

    private final FacultadRepository repository;
    private final FacultadMapper mapper;
    private final InstitucionRepository institucionRepository;

    @Override
    @Transactional
    public FacultadResponse crear(FacultadRequest request) {
        Facultad facultad = mapper.toEntity(request);
        
        Institucion institucion = institucionRepository.findById(request.getInstitucionId())
            .orElseThrow(() -> new ProductoDocenteNotFoundException(request.getInstitucionId()));
        
        facultad.setInstitucion(institucion);
        return mapper.toResponse(repository.save(facultad));
    }

    @Override
    @Transactional
    public FacultadResponse actualizar(Long id, FacultadRequest request) {
        Facultad facultad = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        
        facultad.setNombre(request.getNombre());
        
        Institucion institucion = institucionRepository.findById(request.getInstitucionId())
            .orElseThrow(() -> new ProductoDocenteNotFoundException(request.getInstitucionId()));
        
        facultad.setInstitucion(institucion);
        return mapper.toResponse(repository.save(facultad));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new ProductoDocenteNotFoundException(id);
        repository.deleteById(id);
    }

    @Override
    public FacultadResponse buscarPorId(Long id) {
        Facultad facultad = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        return mapper.toResponse(facultad);
    }

    @Override
    public List<FacultadResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public Page<FacultadResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable)
            .map(mapper::toResponse);
    }

    @Override
    public List<FacultadResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    public List<FacultadResponse> buscarPorInstitucion(Long institucionId) {
        return mapper.toResponseList(repository.findByInstitucionId(institucionId));
    }
}
