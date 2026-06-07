package com.sgpa.builder;

import java.util.List;
import java.util.Map;

import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.TipoProducto;

import com.sgpa.model.products.TipoProductoAtributo;
import com.sgpa.model.users.Docente;

public class ProductoDocenteBuilder implements IProductoBuilder<ProductoDocente> {

    private final ProductoDocente producto = new ProductoDocente();

    private ProductoDocenteBuilder() {}

    public static ProductoDocenteBuilder nuevo() {
        return new ProductoDocenteBuilder();
    }

    @Override
    public ProductoDocenteBuilder nombre(String nombre) {
        producto.setNombre(nombre);
        return this;
    }

    @Override
    public ProductoDocenteBuilder descripcion(String descripcion) {
        producto.setDescripcion(descripcion);
        return this;
    }

    public ProductoDocenteBuilder tipoProducto(TipoProducto tipo) {
        producto.setTipoProducto(tipo);
        return this;
    }

    public ProductoDocenteBuilder docente(Docente docente) {
        producto.setDocente(docente);
        return this;
    }

    @Override
    public ProductoDocenteBuilder atributos(Map<String, Object> atributos) {
        if (atributos != null)
            producto.getAtributos().putAll(atributos);
        return this;
    }

    @Override
    public ProductoDocente build() {
        validar();
        return producto;
    }

    private void validar() {
        if (producto.getNombre() == null || producto.getNombre().isBlank())
            throw new IllegalStateException(
                "El nombre del producto es obligatorio");

        if (producto.getTipoProducto() == null)
            throw new IllegalStateException(
                "El tipo del producto es obligatorio");

        // Valida atributos requeridos según la BD
        List<String> faltantes = producto.getTipoProducto()
            .getAtributos().stream()
            .filter(TipoProductoAtributo::getRequerido)
            .map(TipoProductoAtributo::getNombreAtributo)
            .filter(clave ->
                !producto.getAtributos().containsKey(clave)
                || producto.getAtributos().get(clave) == null
                || producto.getAtributos().get(clave)
                    .toString().isBlank())
            .toList();

        if (!faltantes.isEmpty())
            throw new IllegalStateException(
                "Faltan atributos requeridos: " + faltantes);
    }
}