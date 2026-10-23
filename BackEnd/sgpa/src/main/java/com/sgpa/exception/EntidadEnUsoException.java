package com.sgpa.exception;

/**
 * Excepción lanzada cuando se intenta eliminar una entidad que tiene registros dependientes
 */
public class EntidadEnUsoException extends RuntimeException {
    public EntidadEnUsoException(String message) {
        super(message);
    }
}
