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
import com.sgpa.repository.AdministrativoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdministrativoServiceImpl implements AdministrativoService {

    private final AdministrativoRepository repository;
    private final AdministrativoMapper mapper;

    @Override
    @Transactional
    public AdministrativoResponse crear(AdministrativoRequest request) {
        Administrativo administrativo = mapper.toEntity(request);
        return mapper.toResponse(repository.save(administrativo));
    }

    @Override
    @Transactional
    public AdministrativoResponse actualizar(Long id, AdministrativoRequest request) {
        Administrativo administrativo = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        
        administrativo.setNombre(request.getNombre());
        administrativo.setApellido(request.getApellido());
        administrativo.setCedula(request.getCedula());
        administrativo.setTelefono(request.getTelefono());
        administrativo.setCargo(request.getCargo());
        administrativo.setTipoContrato(request.getTipoContrato());
        administrativo.setDependencia(request.getDependencia());
        
        return mapper.toResponse(repository.save(administrativo));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id))
            throw new ProductoDocenteNotFoundException(id);
        repository.deleteById(id);
    }

    @Override
    public AdministrativoResponse buscarPorId(Long id) {
        Administrativo administrativo = repository.findById(id)
            .orElseThrow(() -> new ProductoDocenteNotFoundException(id));
        return mapper.toResponse(administrativo);
    }

    @Override
    public List<AdministrativoResponse> buscarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public Page<AdministrativoResponse> buscarTodosPaginado(Pageable pageable) {
        return repository.findAll(pageable)
            .map(mapper::toResponse);
    }

    @Override
    public List<AdministrativoResponse> buscarPorNombre(String nombre) {
        return mapper.toResponseList(repository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    public List<AdministrativoResponse> buscarPorApellido(String apellido) {
        return mapper.toResponseList(repository.findByApellidoContainingIgnoreCase(apellido));
    }

    @Override
    public List<AdministrativoResponse> buscarPorCargo(String cargo) {
        return mapper.toResponseList(repository.findByCargoContainingIgnoreCase(cargo));
    }

    @Override
    public List<AdministrativoResponse> buscarPorDependencia(String dependencia) {
        return mapper.toResponseList(repository.findByDependencia(dependencia));
    }
}
