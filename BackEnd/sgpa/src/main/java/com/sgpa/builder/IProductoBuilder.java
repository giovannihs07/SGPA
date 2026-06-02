package com.sgpa.builder;

import java.util.Map;

public interface IProductoBuilder<T> {
    IProductoBuilder<T> nombre(String nombre);
    IProductoBuilder<T> descripcion(String descripcion);
    IProductoBuilder<T> atributos(Map<String, Object> atributos);
    T build();
}

