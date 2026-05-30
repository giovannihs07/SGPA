package com.universidad.service;

public interface UniversidadService {
    boolean validarDocenteActivo(String cedula);
    boolean validarAdministrativoActivo(String cedula);
}
