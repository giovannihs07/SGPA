package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.mapper.DocenteMapper;
import com.sgpa.model.Docente;
import com.sgpa.model.Programa;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocenteServiceImpl implements DocenteService {

    private final DocenteRepository repository;
    private final DocenteMapper mapper;
    private final ProgramaRepository programaRepository;

    @Override
    @Transactional
    public DocenteResponse crear(DocenteRequest request) {
        Docente docente = mapper.toEntity(request);
        
        Programa programa = programaRepository.findById(request.getProgramaId())
            .orElseThrow(() -> new ProductoDocenteNotFoundException(request.getProgramaId()));
        
        docente.setPrograma(programa);
        return mapper.toResponse(repository.save(docente));
    }

    @Override
    @Transactional
    public DocenteResponse actualizar(Long id, DocenteRequest request) {
        Docente docente = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        
        docente.setNombre(request.getNombre());
        docente.setApellido(request.getApellido());
        docente.setCedula(request.getCedula());
        docente.setTelefono(request.getTelefono());
        docente.setCodigoDocente(request.getCodigoDocente());
        docente.setTitulo(request.getTitulo());
        docente.setTipoContrato(request.getTipoContrato());
        
        Programa programa = programaRepository.findById(request.getProgramaId())
            .orElseThrow(() -> new ProductoDocenteNotFoundException(request.getProgramaId()));
        
        docente.setPrograma(programa);
        return mapper.toResponse(repository.save(docente));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new ProductoDocenteNotFoundException(id);
        repository.deleteById(id);
    }

    @Override
    public DocenteResponse buscarPorId(Long id) {
        Docente docente = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        return mapper.toResponse(docente);
    }

    @Override
    public List<DocenteResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public Page<DocenteResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable)
            .map(mapper::toResponse);
    }

    @Override
    public List<DocenteResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    public List<DocenteResponse> buscarPorApellido(String apellido) {
        return mapper.toResponseList(repository.findByApellidoContainingIgnoreCase(apellido));
    }

    @Override
    public List<DocenteResponse> buscarPorPrograma(Long programaId) {
        return mapper.toResponseList(repository.findByProgramaId(programaId));
    }

    @Override
    public List<DocenteResponse> buscarPorTitulo(String titulo) {
        return mapper.toResponseList(repository.findByTitulo(titulo));
    }

    @Override
    public List<DocenteResponse> buscarPorTipoContrato(String tipoContrato) {
        return mapper.toResponseList(repository.findByTipoContrato(tipoContrato));
    }
}
