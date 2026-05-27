package com.sgpa.exception;

public class ProductoNoEliminableException extends RuntimeException {

    public ProductoNoEliminableException() {
        super("No se puede eliminar un producto publicado. Despublícalo primero.");
    }
}
