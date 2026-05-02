package com.proyectogrado.sgpa.model;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ProductoDocenteBuilder {

    private ProductoDocente producto = new ProductoDocente();

    public ProductoDocenteBuilder nombre(String nombre) {
        producto.setNombre(nombre);
        return this;
    }

    public ProductoDocenteBuilder estado(EstadoProducto estado) {
        producto.setEstado(estado);
        return this;
    }

    public ProductoDocenteBuilder descripcion(String descripcion) {
        producto.setDescripcion(descripcion);
        return this;
    }

    public ProductoDocenteBuilder tipo(TipoProducto tipo) {
        producto.setTipo(tipo);
        producto.setSubcategoria(tipo.getSubcategoria());
        producto.setCategoria(resolverCategoria(tipo.getSubcategoria()));
        return this;
    }

    private CategoriaProducto resolverCategoria(SubcategoriaProducto sub) {
    return switch (sub) {
        case NUEVO_CONOCIMIENTO,
             DESARROLLO_TECNOLOGICO,
             APROPIACION_SOCIAL,
             DIVULGACION_PUBLICA_CIENCIA,
             FORMACION_RECURSO_HUMANO -> CategoriaProducto.INVESTIGATIVO;

        case MATERIAL_DIDACTICO,
             ACTIVIDAD_DOCENTE,
             GESTION_ACADEMICA,
             EXTENSION              -> CategoriaProducto.ACADEMICO;
    };
}

    public ProductoDocenteBuilder atributo(String clave, Object valor) {
        producto.getAtributos().put(clave, valor);
        return this;
    }

    public ProductoDocenteBuilder atributos(Map<String, Object> atributos) {
        producto.getAtributos().putAll(atributos);
        return this;
    }

    public ProductoDocente build() {
        validar();
        ProductoDocente resultado = this.producto;
        this.producto = new ProductoDocente(); // reset
        return resultado;
    }

    private void validar() {
        List<String> requeridos = producto.getTipo().getAtributosRequeridos();
        List<String> faltantes = requeridos.stream()
                .filter(attr -> !producto.getAtributos().containsKey(attr))
                .toList();

        if (!faltantes.isEmpty())
            throw new IllegalStateException(
                    "Faltan atributos requeridos para " + producto.getTipo() + ": " + faltantes);
    }
}
