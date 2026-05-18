package com.sgpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.AdministrativoRequest;
import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.exception.ProductoDocenteNotFoundException;
import com.sgpa.mapper.AdministrativoMapper;
import com.sgpa.model.Administrativo;
import com.sgpa.model.Persona;
import com.sgpa.repository.AdministrativoRepository;
import com.sgpa.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdministrativoServiceImpl implements AdministrativoService {

    private final AdministrativoRepository repository;
    private final AdministrativoMapper mapper;
    private final PersonaRepository personaRepository;

    @Override
    @Transactional
    public AdministrativoResponse crear(AdministrativoRequest request) {
        Persona persona = personaRepository.save(mapper.toPersonaEntity(request));
        Administrativo administrativo = mapper.toAdministrativo(request, persona);
        return mapper.toResponse(repository.save(administrativo));
    }

    @Override
    @Transactional
    public AdministrativoResponse actualizar(Long id, AdministrativoRequest request) {
        Administrativo administrativo = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));

        mapper.updatePersona(administrativo.getPersona(), request);
        personaRepository.save(administrativo.getPersona());
        mapper.updateAdministrativoFields(administrativo, request);

        return mapper.toResponse(repository.save(administrativo));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Administrativo administrativo = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        Long personaId = administrativo.getPersona().getId();
        repository.delete(administrativo);
        personaRepository.deleteById(personaId);
    }

    @Override
    @Transactional(readOnly = true)
    public AdministrativoResponse buscarPorId(Long id) {
        Administrativo administrativo = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        return mapper.toResponse(administrativo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativoResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdministrativoResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativoResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativoResponse> buscarPorApellido(String apellido) {
        return mapper.toResponseList(repository.findByApellidoContainingIgnoreCase(apellido));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativoResponse> buscarPorCargo(String cargo) {
        return mapper.toResponseList(repository.findByCargoContainingIgnoreCase(cargo));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativoResponse> buscarPorDependencia(String dependencia) {
        return mapper.toResponseList(repository.findByDependencia(dependencia));
    }
}
