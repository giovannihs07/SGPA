package com.sgpa.exception;

import java.util.Arrays;

import com.sgpa.model.products.TipoProducto;

public class TipoProductoInvalidoException extends RuntimeException {
    public TipoProductoInvalidoException(String tipo) {
        super("Tipo de producto no válido: " + tipo +
              ". Valores aceptados: " + Arrays.toString(TipoProducto.values()));
    }
}