package com.sgpa.builder;

import java.util.List;
import java.util.Map;

import com.sgpa.model.Docente;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.TipoProducto;

public class ProductoDocenteBuilder {

    private ProductoDocente producto;

    private ProductoDocenteBuilder() {
        this.producto = new ProductoDocente();
    }

    public static ProductoDocenteBuilder nuevo() {
        return new ProductoDocenteBuilder();
    }

    public ProductoDocenteBuilder nombre(String nombre) {
        producto.setNombre(nombre);
        return this;
    }

    public ProductoDocenteBuilder descripcion(String descripcion) {
        producto.setDescripcion(descripcion);
        return this;
    }

    public ProductoDocenteBuilder publicado(Boolean publicado) {
        producto.setPublicado(publicado);
        return this;
    }

    public ProductoDocenteBuilder tipo(TipoProducto tipo) {
        producto.setTipo(tipo);
        return this;
    }

    public ProductoDocenteBuilder docente(Docente docente) {
        producto.setDocente(docente);
        return this;
    }

    public ProductoDocenteBuilder atributo(String clave, Object valor) {
        producto.getAtributos().put(clave, valor);
        return this;
    }

    public ProductoDocenteBuilder atributos(Map<String, Object> atributos) {
        if (atributos != null)
            producto.getAtributos().putAll(atributos);
        return this;
    }

    public ProductoDocente build() {
        validar();
        return this.producto;
    }

    private void validar() {
        if (producto.getTipo() == null)
            throw new IllegalStateException("El tipo del producto es obligatorio");

        if (producto.getNombre() == null || producto.getNombre().isBlank())
            throw new IllegalStateException("El nombre del producto es obligatorio");

        List<String> requeridos = producto.getTipo().getAtributosRequeridos();
        List<String> faltantes = requeridos.stream()
            .filter(attr -> !producto.getAtributos().containsKey(attr)
                || producto.getAtributos().get(attr) == null
                || producto.getAtributos().get(attr).toString().isBlank())
            .toList();

        if (!faltantes.isEmpty())
            throw new IllegalStateException(
                "Faltan atributos requeridos para "
                + producto.getTipo() + ": " + faltantes);
    }
}