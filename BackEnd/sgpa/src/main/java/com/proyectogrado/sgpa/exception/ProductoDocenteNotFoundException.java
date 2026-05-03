package com.proyectogrado.sgpa.exception;

public class ProductoDocenteNotFoundException extends RuntimeException {
    public ProductoDocenteNotFoundException(Long id) {
        super("Producto docente no encontrado con id: " + id);
    }
}
