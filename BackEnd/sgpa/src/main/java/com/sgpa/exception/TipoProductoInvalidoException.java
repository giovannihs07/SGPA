package com.sgpa.exception;

public class TipoProductoInvalidoException extends RuntimeException {
    public TipoProductoInvalidoException(String tipo) {
        super("Tipo de producto no válido: " + tipo);
    }
}