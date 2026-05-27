package com.sgpa.exception;

public class ProductoNoEditableException extends RuntimeException {

    public ProductoNoEditableException() {
        super("No se puede editar un producto publicado. Despublícalo primero.");
    }
}
