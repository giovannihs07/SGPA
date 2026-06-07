package com.sgpa.mapper;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.ProductoArchivoResponse;
import com.sgpa.model.products.ProductoArchivo;

@Component
public class ProductoArchivoMapper {

    public ProductoArchivoResponse toDTO(ProductoArchivo archivo) {
        if (archivo == null) return null;
        return ProductoArchivoResponse.builder()
                .id(archivo.getId())
                .nombreOriginal(archivo.getNombreOriginal())
                .rol(archivo.getRol())
                .orden(archivo.getOrden())
                .extensionArchivo(extraerExtension(archivo.getNombreOriginal()))
                .fechaSubida(archivo.getFechaSubida())
                .accesoPublico(archivo.getAccesoPublico())
                .descargable(null)
                .build();
    }

    public List<ProductoArchivoResponse> toDTOList(List<ProductoArchivo> archivos) {
        if (archivos == null) return List.of();
        return archivos.stream()
                .sorted(Comparator.comparing(a -> a.getOrden() != null ? a.getOrden() : 0))
                .map(this::toDTO)
                .toList();
    }

    private String extraerExtension(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) return null;
        return nombreOriginal
                .substring(nombreOriginal.lastIndexOf('.') + 1)
                .toUpperCase();
    }
}
