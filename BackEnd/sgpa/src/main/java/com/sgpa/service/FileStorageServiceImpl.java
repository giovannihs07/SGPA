package com.sgpa.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sgpa.exception.ArchivoNotFoundException;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path directorioBase;

    public FileStorageServiceImpl(@Value("${app.upload.dir:uploads/productos}") String uploadDir) {
        this.directorioBase = resolveUploadDirectory(uploadDir);
        try {
            Files.createDirectories(this.directorioBase);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads", e);
        }
    }

    /**
     * Resuelve la carpeta de uploads según desde dónde se ejecute la app:
     * - Raíz del repo (IDE): uploads/productos
     * - BackEnd/sgpa (Maven): ../../uploads/productos
     */
    private Path resolveUploadDirectory(String uploadDir) {
        List<Path> candidates = List.of(
            Paths.get("uploads/productos"),
            Paths.get("../../uploads/productos"),
            Paths.get(uploadDir)
        );

        for (Path candidate : candidates) {
            Path absolute = candidate.toAbsolutePath().normalize();
            if (Files.isDirectory(absolute) && tieneArchivosDeProducto(absolute)) {
                return absolute;
            }
        }

        for (Path candidate : candidates) {
            Path absolute = candidate.toAbsolutePath().normalize();
            if (Files.isDirectory(absolute)) {
                return absolute;
            }
        }

        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    private boolean tieneArchivosDeProducto(Path dir) {
        try (Stream<Path> files = Files.list(dir)) {
            return files.anyMatch(p ->
                Files.isRegularFile(p)
                && !".gitkeep".equals(p.getFileName().toString())
            );
        } catch (IOException e) {
            return false;
        }
    }

    @Override
    public String[] guardarArchivo(MultipartFile archivo, String tipoProducto) {
        validarArchivo(archivo);

        String extension = obtenerExtension(archivo.getOriginalFilename());
        String nombreOriginal = archivo.getOriginalFilename();
        String nombreInterno = tipoProducto + "_" + UUID.randomUUID() + "." + extension;

        try {
            Path destino = directorioBase.resolve(nombreInterno);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            return new String[] { nombreInterno, nombreOriginal };
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    @Override
    public Resource cargarArchivo(String nombreArchivo) {
        try {
            Path ruta = directorioBase.resolve(nombreArchivo).normalize();
            if (!ruta.startsWith(directorioBase)) {
                throw new ArchivoNotFoundException(nombreArchivo);
            }
            if (Files.exists(ruta) && Files.isRegularFile(ruta)) {
                return new UrlResource(ruta.toUri());
            }
            throw new ArchivoNotFoundException(nombreArchivo);
        } catch (MalformedURLException e) {
            throw new ArchivoNotFoundException(nombreArchivo);
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
        List<String> extensionesPermitidas = List.of("pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "rar",
                "jpg", "jpeg", "png", "gif", "java", "py", "txt");

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
