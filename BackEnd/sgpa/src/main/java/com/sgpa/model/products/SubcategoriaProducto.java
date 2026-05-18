package com.sgpa.model.products;

public enum SubcategoriaProducto {
    // INVESTIGATIVOS

    NUEVO_CONOCIMIENTO(
        CategoriaProducto.INVESTIGATIVO
    ),

    DESARROLLO_TECNOLOGICO(
        CategoriaProducto.INVESTIGATIVO
    ),

    APROPIACION_SOCIAL(
        CategoriaProducto.INVESTIGATIVO
    ),

    DIVULGACION_PUBLICA_CIENCIA(
        CategoriaProducto.INVESTIGATIVO
    ),

    FORMACION_RECURSO_HUMANO(
        CategoriaProducto.INVESTIGATIVO
    ),

    // ACADÉMICOS

    MATERIAL_DIDACTICO(
        CategoriaProducto.ACADEMICO
    ),

    ACTIVIDAD_DOCENTE(
        CategoriaProducto.ACADEMICO
    ),

    GESTION_ACADEMICA(
        CategoriaProducto.ACADEMICO
    ),

    EXTENSION(
        CategoriaProducto.ACADEMICO
    );

    private final CategoriaProducto categoria;

    SubcategoriaProducto(
        CategoriaProducto categoria
    ) {
        this.categoria = categoria;
    }

    public CategoriaProducto getCategoria() {
        return categoria;
    }
}
