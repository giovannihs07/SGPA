package com.sgpa.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.InstitucionRequest;
import com.sgpa.dto.response.InstitucionResponse;
import com.sgpa.mapper.InstitucionMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.institucion.Institucion;
import com.sgpa.repository.InstitucionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstitucionServiceImpl implements InstitucionService {

    private final InstitucionRepository repository;
    private final InstitucionMapper mapper;
    private final AuditService auditService;

    @Override
    @Transactional
    public InstitucionResponse crear(InstitucionRequest dto) {
        if (repository.existsByNit(dto.getNit()))
            throw new IllegalStateException(
                "Ya existe una institución con NIT: " + dto.getNit());

        if (repository.existsByNombre(dto.getNombre()))
            throw new IllegalStateException(
                "Ya existe una institución con nombre: " + dto.getNombre());

        Institucion guardada = repository.save(mapper.toEntity(dto));
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "CREAR_INSTITUCION",
                "Creó la institución \"" + guardada.getNombre() + "\"",
                "Institucion", guardada.getId(), guardada.getNombre(), null,
                ResultadoAuditoria.EXITOSO);
        return mapper.toDTO(guardada);
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

        Institucion guardada = repository.save(institucion);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "EDITAR_INSTITUCION",
                "Editó la institución \"" + guardada.getNombre() + "\"",
                "Institucion", guardada.getId(), guardada.getNombre(), null,
                ResultadoAuditoria.EXITOSO);
        return mapper.toDTO(guardada);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Institucion institucion = buscarEntidad(id);
        String nombre = institucion.getNombre();
        repository.deleteById(id);
        auditService.registrar(ModuloAuditoria.CONFIGURACION, "ELIMINAR_INSTITUCION",
                "Eliminó la institución \"" + nombre + "\"",
                "Institucion", id, nombre, null,
                ResultadoAuditoria.CRITICO);
    }

    private Institucion buscarEntidad(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Institución no encontrada con id: " + id));
    }
}
