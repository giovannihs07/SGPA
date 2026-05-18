package com.sgpa.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.exception.DocenteNotFoundException;
import com.sgpa.exception.ProgramaNotFoundException;
import com.sgpa.mapper.DocenteMapper;
import com.sgpa.mapper.TituloAcademicoMapper;
import com.sgpa.model.Docente;
import com.sgpa.model.Persona;
import com.sgpa.model.Programa;
import com.sgpa.model.TituloAcademico;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.PersonaRepository;
import com.sgpa.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocenteServiceImpl implements DocenteService {

    private final DocenteRepository repository;
    private final DocenteMapper mapper;
    private final PersonaRepository personaRepository;
    private final ProgramaRepository programaRepository;
    private final TituloAcademicoMapper tituloAcademicoMapper;

    @Override
    @Transactional
    public DocenteResponse crear(DocenteRequest request) {
        Persona persona = personaRepository.save(mapper.toPersonaEntity(request));
        Docente docente = mapper.toDocente(request, persona);
        docente.setProgramas(resolveProgramas(request.getProgramaIds()));
        docente.setTitulos(mapTitulos(request.getTitulos(), docente));

        return mapper.toResponse(repository.save(docente));
    }

    @Override
    @Transactional
    public DocenteResponse actualizar(Long id, DocenteRequest request) {
        Docente docente = repository.findById(id)
            .orElseThrow(() -> new DocenteNotFoundException(id));

        mapper.updatePersona(docente.getPersona(), request);
        personaRepository.save(docente.getPersona());
        mapper.updateDocenteFields(docente, request);
        docente.setProgramas(resolveProgramas(request.getProgramaIds()));
        syncTitulos(docente, request.getTitulos());

        return mapper.toResponse(repository.save(docente));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Docente docente = repository.findById(id)
            .orElseThrow(() -> new DocenteNotFoundException(id));
        Long personaId = docente.getPersona().getId();
        repository.delete(docente);
        personaRepository.deleteById(personaId);
    }

    @Override
    @Transactional(readOnly = true)
    public DocenteResponse buscarPorId(Long id) {
        Docente docente = repository.findById(id)
            .orElseThrow(() -> new DocenteNotFoundException(id));
        return mapper.toResponse(docente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocenteResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteResponse> buscarPorApellido(String apellido) {
        return mapper.toResponseList(repository.findByApellidoContainingIgnoreCase(apellido));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteResponse> buscarPorPrograma(Long programaId) {
        return mapper.toResponseList(repository.findByProgramasId(programaId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteResponse> buscarPorTitulo(String titulo) {
        return mapper.toResponseList(repository.findByTitulo(titulo));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteResponse> buscarPorTipoContrato(String tipoContrato) {
        return mapper.toResponseList(repository.findByTipoContrato(tipoContrato));
    }

    @Transactional
    public DocenteResponse agregarPrograma(Long docenteId, Long programaId) {
        Docente docente = repository.findById(docenteId)
            .orElseThrow(() -> new DocenteNotFoundException(docenteId));

        Programa programa = programaRepository.findById(programaId)
            .orElseThrow(() -> new ProgramaNotFoundException(programaId));

        docente.getProgramas().add(programa);
        return mapper.toResponse(repository.save(docente));
    }

    @Transactional
    public DocenteResponse removerPrograma(Long docenteId, Long programaId) {
        Docente docente = repository.findById(docenteId)
            .orElseThrow(() -> new DocenteNotFoundException(docenteId));

        docente.getProgramas().removeIf(p -> p.getId().equals(programaId));
        return mapper.toResponse(repository.save(docente));
    }

    private Set<Programa> resolveProgramas(List<Long> programaIds) {
        Set<Programa> programas = new HashSet<>(programaRepository.findAllById(programaIds));
        if (programas.isEmpty()) {
            throw new ProgramaNotFoundException("No se encontraron los programas especificados");
        }
        return programas;
    }

    private List<TituloAcademico> mapTitulos(List<TituloAcademicoRequest> requests, Docente docente) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }
        return requests.stream()
            .map(request -> tituloAcademicoMapper.toEntity(request, docente))
            .collect(Collectors.toList());
    }

    private void syncTitulos(Docente docente, List<TituloAcademicoRequest> requests) {
        if (docente.getTitulos() == null) {
            docente.setTitulos(new ArrayList<>());
        } else {
            docente.getTitulos().clear();
        }

        if (requests == null || requests.isEmpty()) {
            return;
        }

        docente.getTitulos().addAll(mapTitulos(requests, docente));
    }
}
