package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.ProgramaRequest;
import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.mapper.ProgramaMapper;
import com.sgpa.model.Facultad;
import com.sgpa.model.Programa;
import com.sgpa.repository.FacultadRepository;
import com.sgpa.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgramaServiceImpl implements ProgramaService {

    private final ProgramaRepository repository;
    private final ProgramaMapper mapper;
    private final FacultadRepository facultadRepository;

    @Override
    @Transactional
    public ProgramaResponse crear(ProgramaRequest request) {
        Programa programa = mapper.toEntity(request);
        
        Facultad facultad = facultadRepository.findById(request.getFacultadId())
            .orElseThrow(() -> new ProductoDocenteNotFoundException(request.getFacultadId()));
        
        programa.setFacultad(facultad);
        return mapper.toResponse(repository.save(programa));
    }

    @Override
    @Transactional
    public ProgramaResponse actualizar(Long id, ProgramaRequest request) {
        Programa programa = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        
        programa.setNombre(request.getNombre());
        programa.setCodigo(request.getCodigo());
        programa.setNivel(request.getNivel());
        
        Facultad facultad = facultadRepository.findById(request.getFacultadId())
            .orElseThrow(() -> new ProductoDocenteNotFoundException(request.getFacultadId()));
        
        programa.setFacultad(facultad);
        return mapper.toResponse(repository.save(programa));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new ProductoDocenteNotFoundException(id);
        repository.deleteById(id);
    }

    @Override
    public ProgramaResponse buscarPorId(Long id) {
        Programa programa = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        return mapper.toResponse(programa);
    }

    @Override
    public List<ProgramaResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public Page<ProgramaResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable)
            .map(mapper::toResponse);
    }

    @Override
    public List<ProgramaResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    public List<ProgramaResponse> buscarPorFacultad(Long facultadId) {
        return mapper.toResponseList(repository.findByFacultadId(facultadId));
    }

    @Override
    public List<ProgramaResponse> buscarPorNivel(String nivel) {
        return mapper.toResponseList(repository.findByNivel(nivel));
    }

    @Override
    public List<ProgramaResponse> buscarPorCodigo(String codigo) {
        return mapper.toResponseList(repository.findByCodigo(codigo));
    }
}
