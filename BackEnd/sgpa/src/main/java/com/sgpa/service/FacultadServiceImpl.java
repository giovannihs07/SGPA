package com.sgpa.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;
import com.sgpa.exception.EntidadEnUsoException;
import com.sgpa.exception.FacultadNotFoundException;
import com.sgpa.exception.InstitucionNotFoundException;
import com.sgpa.mapper.FacultadMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.institucion.Facultad;
import com.sgpa.model.institucion.Institucion;
import com.sgpa.repository.FacultadRepository;
import com.sgpa.repository.InstitucionRepository;
import com.sgpa.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultadServiceImpl implements FacultadService {

    private final FacultadRepository facultadRepository;
    private final InstitucionRepository institucionRepository;
    private final ProgramaRepository programaRepository;
    private final FacultadMapper mapper;
    private final AuditService auditService;

    @Override
    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public FacultadResponse crear(FacultadRequest dto) {
        normalizar(dto);
        Institucion institucion = buscarInstitucion(dto.getInstitucionId());

        // Evita duplicados de nombre dentro de la misma institución
        if (facultadRepository.existsByNombreIgnoreCaseAndInstitucionId(
                dto.getNombre(), dto.getInstitucionId()))
            throw new IllegalStateException(
                "Ya existe una facultad con ese nombre en esta institución");

        // Evita duplicados de código globalmente
        if (facultadRepository.existsByCodigoIgnoreCase(dto.getCodigo()))
            throw new IllegalStateException(
                "Ya existe una facultad con código: " + dto.getCodigo());

        Facultad facultad = new Facultad();
        facultad.setNombre(dto.getNombre());
        facultad.setCodigo(dto.getCodigo());
        facultad.setInstitucion(institucion);

        Facultad guardada = facultadRepository.save(facultad);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "CREAR_FACULTAD",
                "Creó la facultad \"" + guardada.getNombre() + "\"",
                "Facultad", guardada.getId(), guardada.getNombre(), null,
                ResultadoAuditoria.EXITOSO);
        return mapper.toDTO(guardada);
    }

    @Override
    public FacultadResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    public List<FacultadResponse> listarTodas() {
        return mapper.toDTOList(facultadRepository.findAll());
    }

    @Override
    public List<FacultadResponse> listarPorInstitucion(Long institucionId) {
        return mapper.toDTOList(
            facultadRepository.findByInstitucionId(institucionId));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public FacultadResponse actualizar(Long id, FacultadRequest dto) {
        Facultad facultad = buscarEntidad(id);
        normalizar(dto);

        // Verifica duplicado de nombre en la institución destino, excluyendo la facultad actual
        if (facultadRepository.existsByNombreIgnoreCaseAndInstitucionIdAndIdNot(
                dto.getNombre(), dto.getInstitucionId(), id))
            throw new IllegalStateException(
                "Ya existe una facultad con ese nombre en esta institución");

        // Verifica duplicado de código excluyendo la facultad actual
        if (facultadRepository.existsByCodigoIgnoreCaseAndIdNot(dto.getCodigo(), id))
            throw new IllegalStateException(
                "Ya existe una facultad con código: " + dto.getCodigo());

        Institucion institucion = buscarInstitucion(dto.getInstitucionId());

        facultad.setNombre(dto.getNombre());
        facultad.setCodigo(dto.getCodigo());
        facultad.setInstitucion(institucion);

        Facultad guardada = facultadRepository.save(facultad);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "EDITAR_FACULTAD",
                "Editó la facultad \"" + guardada.getNombre() + "\"",
                "Facultad", guardada.getId(), guardada.getNombre(), null,
                ResultadoAuditoria.EXITOSO);
        return mapper.toDTO(guardada);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void eliminar(Long id) {
        Facultad facultad = buscarEntidad(id);

        long programas = programaRepository.countByFacultadId(id);
        if (programas > 0)
            throw new EntidadEnUsoException(
                "No se puede eliminar: la facultad tiene " + programas
                + " programa(s) registrado(s).");

        String nombre = facultad.getNombre();
        facultadRepository.deleteById(id);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "ELIMINAR_FACULTAD",
                "Eliminó la facultad \"" + nombre + "\"",
                "Facultad", id, nombre, null,
                ResultadoAuditoria.CRITICO);
    }

    private Facultad buscarEntidad(Long id) {
        return facultadRepository.findById(id)
            .orElseThrow(() -> new FacultadNotFoundException(id));
    }

    private Institucion buscarInstitucion(Long institucionId) {
        return institucionRepository.findById(institucionId)
            .orElseThrow(() -> new InstitucionNotFoundException(institucionId));
    }

    private void normalizar(FacultadRequest dto) {
        dto.setNombre(dto.getNombre().trim());
        dto.setCodigo(dto.getCodigo().trim());
    }
}
