package com.sgpa.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.ProgramaRequest;
import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.exception.EntidadEnUsoException;
import com.sgpa.exception.FacultadNotFoundException;
import com.sgpa.exception.ProgramaNotFoundException;
import com.sgpa.mapper.ProgramaMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.institucion.Facultad;
import com.sgpa.model.institucion.NivelFormacion;
import com.sgpa.model.institucion.Programa;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.FacultadRepository;
import com.sgpa.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgramaServiceImpl implements ProgramaService {

    private final ProgramaRepository programaRepository;
    private final FacultadRepository facultadRepository;
    private final DocenteRepository docenteRepository;
    private final ProgramaMapper mapper;
    private final AuditService auditService;

    @Override
    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ProgramaResponse crear(ProgramaRequest dto) {
        normalizar(dto);
        Facultad facultad = buscarFacultad(dto.getFacultadId());

        if (programaRepository.existsByNombreIgnoreCaseAndFacultadId(
                dto.getNombre(), dto.getFacultadId()))
            throw new IllegalStateException(
                "Ya existe un programa con ese nombre en esta facultad");

        if (programaRepository.existsByCodigoIgnoreCase(dto.getCodigo()))
            throw new IllegalStateException(
                "Ya existe un programa con código: " + dto.getCodigo());

        Programa programa = new Programa();
        programa.setNombre(dto.getNombre());
        programa.setCodigo(dto.getCodigo());
        programa.setNivel(dto.getNivel());
        programa.setFacultad(facultad);

        Programa guardado = programaRepository.save(programa);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "CREAR_PROGRAMA",
                "Creó el programa \"" + guardado.getNombre() + "\"",
                "Programa", guardado.getId(), guardado.getNombre(), null,
                ResultadoAuditoria.EXITOSO);
        return mapper.toDTO(guardado);
    }

    @Override
    public ProgramaResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    public List<ProgramaResponse> listarTodos() {
        return mapper.toDTOList(programaRepository.findAll());
    }

    @Override
    public List<ProgramaResponse> listarPorFacultad(Long facultadId) {
        return mapper.toDTOList(
            programaRepository.findByFacultadId(facultadId));
    }

    @Override
    public List<ProgramaResponse> listarPorInstitucion(Long institucionId) {
        return mapper.toDTOList(
            programaRepository.findByFacultadInstitucionId(institucionId));
    }

    @Override
    public List<ProgramaResponse> listarPorNivel(String nivel) {
        NivelFormacion nivelEnum = parsearNivel(nivel);
        return mapper.toDTOList(programaRepository.findByNivel(nivelEnum));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ProgramaResponse actualizar(Long id, ProgramaRequest dto) {
        Programa programa = buscarEntidad(id);
        normalizar(dto);

        // Verifica duplicado de nombre en la facultad destino, excluyendo el programa actual
        if (programaRepository.existsByNombreIgnoreCaseAndFacultadIdAndIdNot(
                dto.getNombre(), dto.getFacultadId(), id))
            throw new IllegalStateException(
                "Ya existe un programa con ese nombre en esta facultad");

        if (programaRepository.existsByCodigoIgnoreCaseAndIdNot(dto.getCodigo(), id))
            throw new IllegalStateException(
                "Ya existe un programa con código: " + dto.getCodigo());

        Facultad facultad = buscarFacultad(dto.getFacultadId());

        programa.setNombre(dto.getNombre());
        programa.setCodigo(dto.getCodigo());
        programa.setNivel(dto.getNivel());
        programa.setFacultad(facultad);

        Programa guardado = programaRepository.save(programa);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "EDITAR_PROGRAMA",
                "Editó el programa \"" + guardado.getNombre() + "\"",
                "Programa", guardado.getId(), guardado.getNombre(), null,
                ResultadoAuditoria.EXITOSO);
        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void eliminar(Long id) {
        Programa programa = buscarEntidad(id);

        long docentes = docenteRepository.countByProgramaId(id);
        if (docentes > 0)
            throw new EntidadEnUsoException(
                "No se puede eliminar: el programa tiene " + docentes
                + " docente(s) asignado(s).");

        String nombre = programa.getNombre();
        programaRepository.deleteById(id);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "ELIMINAR_PROGRAMA",
                "Eliminó el programa \"" + nombre + "\"",
                "Programa", id, nombre, null,
                ResultadoAuditoria.CRITICO);
    }

    private Programa buscarEntidad(Long id) {
        return programaRepository.findById(id)
            .orElseThrow(() -> new ProgramaNotFoundException(id));
    }

    private Facultad buscarFacultad(Long facultadId) {
        return facultadRepository.findById(facultadId)
            .orElseThrow(() -> new FacultadNotFoundException(facultadId));
    }

    private void normalizar(ProgramaRequest dto) {
        dto.setNombre(dto.getNombre().trim());
        dto.setCodigo(dto.getCodigo().trim());
    }

    private NivelFormacion parsearNivel(String nivel) {
        try {
            return NivelFormacion.valueOf(nivel.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Nivel no válido: " + nivel +
                ". Valores aceptados: " +
                Arrays.toString(NivelFormacion.values()));
        }
    }
}
