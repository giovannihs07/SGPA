package com.sgpa.exception;

public class UsuarioNoPendienteException extends RuntimeException {

    public UsuarioNoPendienteException(String accion) {
        super("Solo se pueden " + accion + " usuarios en estado pendiente.");
    }
}
