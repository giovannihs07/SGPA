package com.proyectogrado.sgpa.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path directorioBase;

    public FileStorageServiceImpl(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.directorioBase = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.directorioBase);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads", e);
        }
    }

    @Override
    public String guardarArchivo(MultipartFile archivo, String tipoProducto) {
        validarArchivo(archivo);

        // Nombre único para evitar colisiones
        String extension = obtenerExtension(archivo.getOriginalFilename());
        String nombreArchivo = tipoProducto + "_" + UUID.randomUUID() + "." + extension;

        try {
            Path destino = directorioBase.resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            return nombreArchivo;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    @Override
    public Resource cargarArchivo(String nombreArchivo) {
        try {
            Path ruta = directorioBase.resolve(nombreArchivo).normalize();
            Resource resource = new UrlResource(ruta.toUri());
            if (resource.exists())
                return resource;
            throw new RuntimeException("Archivo no encontrado: " + nombreArchivo);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Archivo no encontrado: " + nombreArchivo, e);
        }
    }

    @Override
    public void eliminarArchivo(String nombreArchivo) {
        try {
            Path ruta = directorioBase.resolve(nombreArchivo).normalize();
            Files.deleteIfExists(ruta);
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar el archivo", e);
        }
    }

    private void validarArchivo(MultipartFile archivo) {
        if (archivo.isEmpty())
            throw new IllegalStateException("El archivo está vacío");

        String extension = obtenerExtension(archivo.getOriginalFilename()).toLowerCase();
        List<String> extensionesPermitidas = List.of("pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx");

        if (!extensionesPermitidas.contains(extension))
            throw new IllegalStateException("Tipo de archivo no permitido: " + extension);

        // Máximo 10MB
        if (archivo.getSize() > 10 * 1024 * 1024)
            throw new IllegalStateException("El archivo supera el tamaño máximo de 10MB");
    }

    private String obtenerExtension(String nombreArchivo) {
        if (nombreArchivo == null || !nombreArchivo.contains("."))
            throw new IllegalStateException("El archivo no tiene extensión");
        return nombreArchivo.substring(nombreArchivo.lastIndexOf(".") + 1);
    }
}
