package com.sgpa.exception;

public class ArchivoNotFoundException extends RuntimeException {
    public ArchivoNotFoundException(String nombreArchivo) {
        super("Archivo no encontrado: " + nombreArchivo);
    }
}
