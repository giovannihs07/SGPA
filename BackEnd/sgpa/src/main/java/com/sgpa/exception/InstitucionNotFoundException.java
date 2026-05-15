package com.sgpa.exception;

/**
 * Excepción lanzada cuando no se encuentra una Institución
 */
public class InstitucionNotFoundException extends RuntimeException {
    public InstitucionNotFoundException(Long id) {
        super("Institución no encontrada con id: " + id);
    }

    public InstitucionNotFoundException(String message) {
        super(message);
    }
}
