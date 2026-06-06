package com.sgpa.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.dto.request.ProductoArchivoMetaRequest;
import com.sgpa.model.products.ProductoArchivo;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.RolArchivoProducto;
import com.sgpa.model.products.TipoProducto;

// Clase helper para la gestión de archivos de productos docentes
@Component
public class ProductoArchivoHelper {

    // Constante para el máximo de archivos por producto
    public static final int MAX_ARCHIVOS_POR_PRODUCTO = 5;

    private final FileStorageService fileStorageService;

    // Constructor para la inyección de dependencias
    public ProductoArchivoHelper(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    // Método para aplicar los archivos en la creación de un producto
    public void aplicarEnCreacion(
            ProductoDocente producto,
            TipoProducto tipo,
            List<MultipartFile> archivos,
            List<ProductoArchivoMetaRequest> meta) {

        List<MultipartFile> listaArchivos = archivos != null ? archivos : List.of();
        List<ProductoArchivoMetaRequest> listaMeta = meta != null ? meta : List.of();

        validarArchivosNuevos(listaArchivos, listaMeta, true);

        for (int i = 0; i < listaArchivos.size(); i++) {
            agregarArchivo(producto, tipo, listaArchivos.get(i), listaMeta.get(i), i + 1);
        }

        sincronizarCamposLegacy(producto);
    }

    // Método para aplicar los archivos en la actualización de un producto
    public void aplicarEnActualizacion(
            ProductoDocente producto,
            TipoProducto tipo,
            List<Long> archivosEliminarIds,
            List<MultipartFile> archivosNuevos,
            List<ProductoArchivoMetaRequest> meta) {

        if (producto.getArchivos() == null) {
            producto.setArchivos(new ArrayList<>());
        }

        if (archivosEliminarIds != null) {
            for (Long id : archivosEliminarIds) {
                ProductoArchivo existente = producto.getArchivos().stream()
                        .filter(a -> Objects.equals(a.getId(), id))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Archivo no encontrado en el producto: " + id));
                fileStorageService.eliminarArchivo(existente.getNombreInterno());
                producto.getArchivos().remove(existente);
            }
        }

        List<MultipartFile> nuevos = archivosNuevos != null ? archivosNuevos : List.of();
        List<ProductoArchivoMetaRequest> listaMeta = meta != null ? meta : List.of();

        if (!nuevos.isEmpty()) {
            validarArchivosNuevos(nuevos, listaMeta, false);
            int baseOrden = producto.getArchivos().size();
            for (int i = 0; i < nuevos.size(); i++) {
                agregarArchivo(producto, tipo, nuevos.get(i), listaMeta.get(i), baseOrden + i + 1);
            }
        }

        validarPrincipalUnico(producto);
        validarTotalArchivos(producto);
        sincronizarCamposLegacy(producto);
    }

    // Método para eliminar todos los archivos de un producto
    public void eliminarTodos(ProductoDocente producto) {
        if (producto.getArchivos() == null) return;
        for (ProductoArchivo archivo : producto.getArchivos()) {
            fileStorageService.eliminarArchivo(archivo.getNombreInterno());
        }
        producto.getArchivos().clear();
        producto.setNombreArchivo(null);
        producto.setNombreArchivoOriginal(null);
    }

    // Método para sincronizar los campos legacy del producto
    public void sincronizarCamposLegacy(ProductoDocente producto) {
        ProductoArchivo principal = producto.getArchivos() == null ? null
                : producto.getArchivos().stream()
                        .filter(a -> a.getRol() == RolArchivoProducto.PRINCIPAL)
                        .findFirst()
                        .orElse(null);

        if (principal != null) {
            producto.setNombreArchivo(principal.getNombreInterno());
            producto.setNombreArchivoOriginal(principal.getNombreOriginal());
        } else {
            producto.setNombreArchivo(null);
            producto.setNombreArchivoOriginal(null);
        }
    }

    // Método para agregar un archivo a un producto
    private void agregarArchivo(
            ProductoDocente producto,
            TipoProducto tipo,
            MultipartFile archivo,
            ProductoArchivoMetaRequest meta,
            int ordenPorDefecto) {

        String[] nombres = fileStorageService.guardarArchivo(archivo, tipo.getNombre());
        ProductoArchivo entidad = new ProductoArchivo();
        entidad.setProducto(producto);
        entidad.setNombreInterno(nombres[0]);
        entidad.setNombreOriginal(nombres[1]);
        entidad.setRol(meta.getRol());
        entidad.setOrden(meta.getOrden() != null ? meta.getOrden() : ordenPorDefecto);
        producto.getArchivos().add(entidad);
    }

    // Método para validar los archivos nuevos
    private void validarArchivosNuevos(
            List<MultipartFile> archivos,
            List<ProductoArchivoMetaRequest> meta,
            boolean requierePrincipal) {

        if (archivos.isEmpty()) {
            if (requierePrincipal) {
                throw new IllegalStateException(
                        "Debe adjuntar al menos el archivo principal.");
            }
            return;
        }

        if (archivos.size() != meta.size()) {
            throw new IllegalArgumentException(
                    "La cantidad de archivos no coincide con sus metadatos.");
        }

        long principales = meta.stream()
                .filter(m -> m.getRol() == RolArchivoProducto.PRINCIPAL)
                .count();

        if (requierePrincipal && principales != 1) {
            throw new IllegalStateException(
                    "Debe incluir exactamente un archivo con rol Principal.");
        }
        if (!requierePrincipal && principales > 1) {
            throw new IllegalStateException(
                    "Solo puede haber un archivo con rol Principal.");
        }
    }

    // Método para validar que el producto tenga exactamente un archivo Principal
    private void validarPrincipalUnico(ProductoDocente producto) {
        long principales = producto.getArchivos().stream()
                .filter(a -> a.getRol() == RolArchivoProducto.PRINCIPAL)
                .count();
        if (principales != 1) {
            throw new IllegalStateException(
                    "El producto debe tener exactamente un archivo Principal.");
        }
    }

    // Método para validar que el producto no supere el máximo de archivos permitidos
    private void validarTotalArchivos(ProductoDocente producto) {
        if (producto.getArchivos().size() > MAX_ARCHIVOS_POR_PRODUCTO) {
            throw new IllegalStateException(
                    "Máximo " + MAX_ARCHIVOS_POR_PRODUCTO + " archivos por producto.");
        }
    }
}
