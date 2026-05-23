package com.sgpa.exception;

/**
 * Excepción lanzada cuando no se encuentra un Programa
 */
public class ProgramaNotFoundException extends RuntimeException {
    public ProgramaNotFoundException(Long id) {
        super("Programa no encontrado con id: " + id);
    }

    public ProgramaNotFoundException(String message) {
        super(message);
    }
}
