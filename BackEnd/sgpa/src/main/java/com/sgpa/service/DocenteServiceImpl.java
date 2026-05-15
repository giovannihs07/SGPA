package com.sgpa.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.exception.DocenteNotFoundException;
import com.sgpa.exception.ProgramaNotFoundException;
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

    /**
     * Crear un nuevo docente con múltiples programas
     */
    @Override
    @Transactional
    public DocenteResponse crear(DocenteRequest request) {
        Docente docente = mapper.toEntity(request);
        
        // Buscar y asignar los programas
        List<Programa> programas = programaRepository.findAllById(request.getProgramaIds());
        
        if (programas.isEmpty()) {
            throw new ProgramaNotFoundException("No se encontraron los programas especificados");
        }
        
        docente.setProgramas(programas);
        return mapper.toResponse(repository.save(docente));
    }

    /**
     * Actualizar un docente existente
     */
    @Override
    @Transactional
    public DocenteResponse actualizar(Long id, DocenteRequest request) {
        Docente docente = repository.findById(id)
            .orElseThrow(() -> new DocenteNotFoundException(id));
        
        // Actualizar datos personales (heredados de Persona)
        docente.setNombre(request.getNombre());
        docente.setApellido(request.getApellido());
        docente.setCedula(request.getCedula());
        docente.setTelefono(request.getTelefono());
        
        // Actualizar datos específicos del docente
        docente.setCodigoDocente(request.getCodigoDocente());
        docente.setTitulos(request.getTitulos());
        docente.setTipoContrato(request.getTipoContrato());
        
        // Actualizar los programas asociados
        List<Programa> programas = programaRepository.findAllById(request.getProgramaIds());
        
        if (programas.isEmpty()) {
            throw new ProgramaNotFoundException("No se encontraron los programas especificados");
        }
        
        docente.setProgramas(programas);
        return mapper.toResponse(repository.save(docente));
    }

    /**
     * Eliminar un docente por ID
     */
    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new DocenteNotFoundException(id);
        repository.deleteById(id);
    }

    /**
     * Buscar docente por ID
     */
    @Override
    public DocenteResponse buscarPorId(Long id) {
        Docente docente = repository.findById(id)
            .orElseThrow(() -> new DocenteNotFoundException(id));
        return mapper.toResponse(docente);
    }

    /**
     * Obtener todos los docentes
     */
    @Override
    public List<DocenteResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    /**
     * Obtener docentes con paginación
     */
    @Override
    public Page<DocenteResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable)
            .map(mapper::toResponse);
    }

    /**
     * Buscar docentes por nombre
     */
    @Override
    public List<DocenteResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    /**
     * Buscar docentes por apellido
     */
    @Override
    public List<DocenteResponse> buscarPorApellido(String apellido) {
        return mapper.toResponseList(repository.findByApellidoContainingIgnoreCase(apellido));
    }

    /**
     * Buscar docentes que enseñan en un programa específico
     */
    @Override
    public List<DocenteResponse> buscarPorPrograma(Long programaId) {
        return mapper.toResponseList(repository.findByProgramasId(programaId));
    }

    /**
     * Buscar docentes por título
     */
    @Override
    public List<DocenteResponse> buscarPorTitulo(String titulo) {
        return mapper.toResponseList(repository.findByTitulo(titulo));
    }

    /**
     * Buscar docentes por tipo de contrato
     */
    @Override
    public List<DocenteResponse> buscarPorTipoContrato(String tipoContrato) {
        return mapper.toResponseList(repository.findByTipoContrato(tipoContrato));
    }

    /**
     * Agregar un programa a un docente existente
     */
    @Transactional
    public DocenteResponse agregarPrograma(Long docenteId, Long programaId) {
        Docente docente = repository.findById(docenteId)
            .orElseThrow(() -> new DocenteNotFoundException(docenteId));
        
        Programa programa = programaRepository.findById(programaId)
            .orElseThrow(() -> new ProgramaNotFoundException(programaId));
        
        // Evitar duplicados
        if (docente.getProgramas().stream()
                .noneMatch(p -> p.getId().equals(programaId))) {
            docente.getProgramas().add(programa);
            repository.save(docente);
        }
        
        return mapper.toResponse(docente);
    }

    /**
     * Remover un programa de un docente
     */
    @Transactional
    public DocenteResponse removerPrograma(Long docenteId, Long programaId) {
        Docente docente = repository.findById(docenteId)
            .orElseThrow(() -> new DocenteNotFoundException(docenteId));
        
        docente.setProgramas(
            docente.getProgramas().stream()
                .filter(p -> !p.getId().equals(programaId))
                .collect(Collectors.toList())
        );
        
        return mapper.toResponse(repository.save(docente));
    }
}
