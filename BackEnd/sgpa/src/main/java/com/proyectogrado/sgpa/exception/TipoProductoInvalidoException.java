package com.proyectogrado.sgpa.exception;

import java.util.Arrays;

import com.proyectogrado.sgpa.model.TipoProducto;

public class TipoProductoInvalidoException extends RuntimeException {
    public TipoProductoInvalidoException(String tipo) {
        super("Tipo de producto no válido: " + tipo +
              ". Valores aceptados: " + Arrays.toString(TipoProducto.values()));
    }
}