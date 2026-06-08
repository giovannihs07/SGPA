package com.sgpa.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;
import com.sgpa.mapper.FacultadMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.institucion.Facultad;
import com.sgpa.model.institucion.Institucion;
import com.sgpa.repository.FacultadRepository;
import com.sgpa.repository.InstitucionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultadServiceImpl implements FacultadService {

    private final FacultadRepository facultadRepository;
    private final InstitucionRepository institucionRepository;
    private final FacultadMapper mapper;
    private final AuditService auditService;

    @Override
    @Transactional
    public FacultadResponse crear(FacultadRequest dto) {
        Institucion institucion = institucionRepository
            .findById(dto.getInstitucionId())
            .orElseThrow(() -> new RuntimeException(
                "Institución no encontrada con id: " + dto.getInstitucionId()));

        // Evita duplicados de nombre dentro de la misma institución
        if (facultadRepository.existsByNombreAndInstitucionId(
                dto.getNombre(), dto.getInstitucionId()))
            throw new IllegalStateException(
                "Ya existe una facultad con ese nombre en esta institución");

        // Evita duplicados de código globalmente
        if (facultadRepository.existsByCodigo(dto.getCodigo()))
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
    public FacultadResponse actualizar(Long id, FacultadRequest dto) {
        Facultad facultad = buscarEntidad(id);

        // Verifica duplicado de nombre en la misma institución
        // excluyendo la facultad actual
        if (!facultad.getNombre().equals(dto.getNombre())
                && facultadRepository.existsByNombreAndInstitucionId(
                    dto.getNombre(), dto.getInstitucionId()))
            throw new IllegalStateException(
                "Ya existe una facultad con ese nombre en esta institución");

        // Verifica duplicado de código excluyendo la facultad actual
        if (!dto.getCodigo().equals(facultad.getCodigo())
                && facultadRepository.existsByCodigo(dto.getCodigo()))
            throw new IllegalStateException(
                "Ya existe una facultad con código: " + dto.getCodigo());

        Institucion institucion = institucionRepository
            .findById(dto.getInstitucionId())
            .orElseThrow(() -> new RuntimeException(
                "Institución no encontrada con id: " + dto.getInstitucionId()));

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
    public void eliminar(Long id) {
        Facultad facultad = buscarEntidad(id);
        String nombre = facultad.getNombre();
        facultadRepository.deleteById(id);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "ELIMINAR_FACULTAD",
                "Eliminó la facultad \"" + nombre + "\"",
                "Facultad", id, nombre, null,
                ResultadoAuditoria.CRITICO);
    }

    private Facultad buscarEntidad(Long id) {
        return facultadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Facultad no encontrada con id: " + id));
    }
}
