package com.sgpa.exception;

/**
 * Excepción lanzada cuando no se encuentra un Docente
 */
public class DocenteNotFoundException extends RuntimeException {
    public DocenteNotFoundException(Long id) {
        super("Docente no encontrado con id: " + id);
    }

    public DocenteNotFoundException(String message) {
        super(message);
    }
}
