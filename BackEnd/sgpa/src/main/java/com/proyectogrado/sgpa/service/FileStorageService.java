package com.proyectogrado.sgpa.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String guardarArchivo(MultipartFile archivo, String tipoProducto);
    Resource cargarArchivo(String nombreArchivo);
    void eliminarArchivo(String nombreArchivo);
}
