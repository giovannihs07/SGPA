package com.sgpa.exception;

/**
 * Excepción lanzada cuando no se encuentra una Persona
 */
public class PersonaNotFoundException extends RuntimeException {
    public PersonaNotFoundException(Long id) {
        super("Persona no encontrada con id: " + id);
    }

    public PersonaNotFoundException(String message) {
        super(message);
    }
}
