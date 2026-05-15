package com.sgpa.exception;

/**
 * Excepción lanzada cuando no se encuentra una Facultad
 */
public class FacultadNotFoundException extends RuntimeException {
    public FacultadNotFoundException(Long id) {
        super("Facultad no encontrada con id: " + id);
    }

    public FacultadNotFoundException(String message) {
        super(message);
    }
}
