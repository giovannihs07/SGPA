package com.universidad.service;

import org.springframework.stereotype.Service;

import com.universidad.repository.UniAdministrativoRepository;
import com.universidad.repository.UniDocenteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UniversidadServiceImpl implements UniversidadService {

    private final UniDocenteRepository uniDocenteRepository;
    private final UniAdministrativoRepository uniAdministrativoRepository;

    @Override
    public boolean validarDocenteActivo(String cedula) {
        return uniDocenteRepository
                .existsByPersonaCedulaAndPersonaHabilitadoTrueAndActivoTrue(cedula);
    }

    @Override
    public boolean validarAdministrativoActivo(String cedula) {
        return uniAdministrativoRepository
                .existsByPersonaCedulaAndPersonaHabilitadoTrueAndActivoTrue(cedula);
    }
}
