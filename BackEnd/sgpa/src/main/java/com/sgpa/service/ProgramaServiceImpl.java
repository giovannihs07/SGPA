package com.sgpa.service;

import java.util.Arrays;
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
import com.sgpa.model.NivelFormacion;
import com.sgpa.model.Programa;
import com.sgpa.repository.FacultadRepository;
import com.sgpa.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgramaServiceImpl implements ProgramaService {

    private final ProgramaRepository programaRepository;
    private final FacultadRepository facultadRepository;
    private final ProgramaMapper mapper;

    @Override
    @Transactional
    public ProgramaResponse crear(ProgramaRequest dto) {
        Facultad facultad = facultadRepository.findById(dto.getFacultadId())
            .orElseThrow(() -> new RuntimeException(
                "Facultad no encontrada con id: " + dto.getFacultadId()));

        if (programaRepository.existsByNombreAndFacultadId(
                dto.getNombre(), dto.getFacultadId()))
            throw new IllegalStateException(
                "Ya existe un programa con ese nombre en esta facultad");

        if (dto.getCodigo() != null
                && programaRepository.existsByCodigo(dto.getCodigo()))
            throw new IllegalStateException(
                "Ya existe un programa con código: " + dto.getCodigo());

        Programa programa = new Programa();
        programa.setNombre(dto.getNombre());
        programa.setCodigo(dto.getCodigo());
        programa.setNivel(dto.getNivel());
        programa.setFacultad(facultad);

        return mapper.toDTO(programaRepository.save(programa));
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
    public ProgramaResponse actualizar(Long id, ProgramaRequest dto) {
        Programa programa = buscarEntidad(id);

        if (!programa.getNombre().equals(dto.getNombre())
                && programaRepository.existsByNombreAndFacultadId(
                    dto.getNombre(), dto.getFacultadId()))
            throw new IllegalStateException(
                "Ya existe un programa con ese nombre en esta facultad");

        if (dto.getCodigo() != null
                && !dto.getCodigo().equals(programa.getCodigo())
                && programaRepository.existsByCodigo(dto.getCodigo()))
            throw new IllegalStateException(
                "Ya existe un programa con código: " + dto.getCodigo());

        Facultad facultad = facultadRepository.findById(dto.getFacultadId())
            .orElseThrow(() -> new RuntimeException(
                "Facultad no encontrada con id: " + dto.getFacultadId()));

        programa.setNombre(dto.getNombre());
        programa.setCodigo(dto.getCodigo());
        programa.setNivel(dto.getNivel());
        programa.setFacultad(facultad);

        return mapper.toDTO(programaRepository.save(programa));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!programaRepository.existsById(id))
            throw new RuntimeException(
                "Programa no encontrado con id: " + id);
        programaRepository.deleteById(id);
    }

    private Programa buscarEntidad(Long id) {
        return programaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Programa no encontrado con id: " + id));
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
