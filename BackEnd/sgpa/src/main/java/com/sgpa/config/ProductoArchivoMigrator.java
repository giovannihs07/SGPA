package com.sgpa.config;

import java.util.ArrayList;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.model.products.ProductoArchivo;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.RolArchivoProducto;
import com.sgpa.repository.ProductoDocenteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Migra archivos legacy (nombreArchivo en producto) a la entidad ProductoArchivo.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProductoArchivoMigrator implements ApplicationRunner {

    private final ProductoDocenteRepository productoRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        int migrados = 0;
        for (ProductoDocente producto : productoRepository.findAll()) {
            if (producto.getNombreArchivo() == null) continue;
            if (producto.getArchivos() != null && !producto.getArchivos().isEmpty()) continue;

            if (producto.getArchivos() == null) {
                producto.setArchivos(new ArrayList<>());
            }

            ProductoArchivo principal = new ProductoArchivo();
            principal.setProducto(producto);
            principal.setNombreInterno(producto.getNombreArchivo());
            principal.setNombreOriginal(producto.getNombreArchivoOriginal());
            principal.setRol(RolArchivoProducto.PRINCIPAL);
            principal.setOrden(1);
            producto.getArchivos().add(principal);
            productoRepository.save(producto);
            migrados++;
        }
        if (migrados > 0) {
            log.info("Migrados {} producto(s) con archivo legacy a ProductoArchivo.", migrados);
        }
    }
}
