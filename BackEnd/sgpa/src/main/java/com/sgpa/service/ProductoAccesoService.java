package com.sgpa.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.sgpa.dto.response.ProductoArchivoResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.model.products.ProductoArchivo;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.RolArchivoProducto;
import com.sgpa.model.users.Docente;
import com.sgpa.repository.DocenteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoAccesoService {

    // Enums para representar los diferentes visores de producto según el rol del usuario
    public enum VisorProducto {
        PROPIETARIO, ADMIN, PUBLICO
    }

    private final DocenteRepository docenteRepository;

    // Resolver el visor de producto según el rol del usuario autenticado y la relación con el producto
    public VisorProducto resolverVisor(ProductoDocente producto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth instanceof AnonymousAuthenticationToken) {
            return VisorProducto.PUBLICO;
        }

        // Verificar si el usuario autenticado es un administrador
        if (esAdmin(auth)) {
            return VisorProducto.ADMIN;
        }

        // Verificar si el usuario autenticado es el propietario del producto
        Optional<Docente> docente = docenteRepository.findByUserEmail(auth.getName());
        if (docente.isPresent()
                && producto.getDocente() != null
                && docente.get().getId().equals(producto.getDocente().getId())) {
            return VisorProducto.PROPIETARIO;
        }

        return VisorProducto.PUBLICO;
    }

    // Aplicar el filtro de acceso a un producto según el visor determinado
    public ProductoDocenteResponse aplicarFiltroAcceso(
            ProductoDocenteResponse dto,
            ProductoDocente entidad,
            VisorProducto visor) {

        if (dto == null || entidad == null) {
            return dto;
        }

        // Obtener la lista de archivos del producto, manejando el caso de que sea nula
        List<ProductoArchivo> archivosEntidad = entidad.getArchivos() != null
                ? entidad.getArchivos()
                : List.of();

        return switch (visor) {
            case PROPIETARIO -> aplicarVistaPropietario(dto, archivosEntidad);
            case ADMIN -> aplicarVistaAdmin(dto, archivosEntidad, entidad);
            case PUBLICO -> aplicarVistaPublico(dto, archivosEntidad, entidad);
        };
    }

    // Determinar si un archivo es visible públicamente según su acceso público y la lógica de legado
    public boolean esVisiblePublicamente(ProductoArchivo archivo, List<ProductoArchivo> todos) {
        if (Boolean.TRUE.equals(archivo.getAccesoPublico())) {
            return true;
        }
        return esLegacyPrincipalPublico(archivo, todos);
    }

    // Determinar si un archivo puede ser descargado públicamente según su visibilidad y el estado de publicación del producto
    public boolean puedeDescargarPublicamente(ProductoArchivo archivo, ProductoDocente producto) {
        if (!Boolean.TRUE.equals(producto.getPublicado())) {
            return false;
        }
        List<ProductoArchivo> archivos = producto.getArchivos() != null
                ? producto.getArchivos()
                : List.of();
        return esVisiblePublicamente(archivo, archivos);
    }

    // Métodos privados auxiliares para aplicar las vistas según el rol del usuario
    private ProductoDocenteResponse aplicarVistaPropietario(
            ProductoDocenteResponse dto,
            List<ProductoArchivo> archivosEntidad) {

        dto.setArchivos(archivosEntidad.stream()
                .sorted(ordenarPorOrden())
                .map(a -> toArchivoResponse(a, a.getAccesoPublico(), true))
                .toList());
        dto.setTotalArchivosRestringidos((int) contarRestringidos(archivosEntidad));
        return dto;
    }

    // Aplicar la vista de administrador, mostrando todos los archivos y sincronizando el archivo principal según la lógica de legado
    private ProductoDocenteResponse aplicarVistaAdmin(
            ProductoDocenteResponse dto,
            List<ProductoArchivo> archivosEntidad,
            ProductoDocente entidad) {

        List<ProductoArchivoResponse> archivos = archivosEntidad.stream()
                .sorted(ordenarPorOrden())
                .map(a -> toArchivoResponse(
                        a,
                        a.getAccesoPublico(),
                        Boolean.TRUE.equals(a.getAccesoPublico())))
                .toList();

        dto.setArchivos(archivos);
        dto.setTotalArchivosRestringidos((int) contarRestringidos(archivosEntidad));
        sincronizarLegacyPrincipal(dto, archivosEntidad, entidad);
        return dto;
    }

    // Aplicar la vista pública, mostrando solo los archivos visibles públicamente y sincronizando el archivo principal según la lógica de legado
    private ProductoDocenteResponse aplicarVistaPublico(
            ProductoDocenteResponse dto,
            List<ProductoArchivo> archivosEntidad,
            ProductoDocente entidad) {

        List<ProductoArchivoResponse> publicos = archivosEntidad.stream()
                .filter(a -> esVisiblePublicamente(a, archivosEntidad))
                .sorted(ordenarPorOrden())
                .map(a -> toArchivoResponse(a, true, true))
                .toList();

        dto.setArchivos(publicos);
        dto.setTotalArchivosRestringidos(null);
        sincronizarLegacyPrincipal(dto, archivosEntidad, entidad);
        return dto;
    }

    // Convertir una entidad ProductoArchivo a un DTO ProductoArchivoResponse, incluyendo información sobre acceso público y descargabilidad
    private ProductoArchivoResponse toArchivoResponse(
            ProductoArchivo archivo,
            Boolean accesoPublico,
            boolean descargable) {

        return ProductoArchivoResponse.builder()
                .id(archivo.getId())
                .nombreOriginal(archivo.getNombreOriginal())
                .rol(archivo.getRol())
                .orden(archivo.getOrden())
                .extensionArchivo(extraerExtension(archivo.getNombreOriginal()))
                .fechaSubida(archivo.getFechaSubida())
                .accesoPublico(accesoPublico)
                .descargable(descargable)
                .build();
    }

    // Sincronizar la información del archivo principal en el DTO según la lógica de legado, considerando la visibilidad pública de los archivos
    private void sincronizarLegacyPrincipal(
            ProductoDocenteResponse dto,
            List<ProductoArchivo> archivosEntidad,
            ProductoDocente entidad) {

        ProductoArchivo principalVisible = archivosEntidad.stream()
                .filter(a -> a.getRol() == RolArchivoProducto.PRINCIPAL)
                .filter(a -> esVisiblePublicamente(a, archivosEntidad))
                .findFirst()
                .orElse(null);

        if (principalVisible != null) {
            dto.setNombreArchivo(principalVisible.getNombreInterno());
            dto.setNombreArchivoOriginal(principalVisible.getNombreOriginal());
            dto.setExtensionArchivo(extraerExtension(principalVisible.getNombreOriginal()));
        } else {
            dto.setNombreArchivo(null);
            dto.setNombreArchivoOriginal(null);
            dto.setExtensionArchivo(null);
        }
    }

    // Determinar si un archivo principal es considerado "legacy" y público según la lógica de negocio, verificando que no haya otros archivos públicos
    private boolean esLegacyPrincipalPublico(ProductoArchivo archivo, List<ProductoArchivo> todos) {
        if (archivo.getRol() != RolArchivoProducto.PRINCIPAL) {
            return false;
        }
        return todos.stream().noneMatch(a -> Boolean.TRUE.equals(a.getAccesoPublico()));
    }

    // Contar la cantidad de archivos restringidos (no públicos) en la lista de archivos
    private long contarRestringidos(List<ProductoArchivo> archivos) {
        return archivos.stream()
                .filter(a -> !Boolean.TRUE.equals(a.getAccesoPublico()))
                .count();
    }

    // Ordenar los archivos por el campo "orden", considerando que puede ser nulo y asignando un valor predeterminado de 0
    private Comparator<ProductoArchivo> ordenarPorOrden() {
        return Comparator.comparing(a -> a.getOrden() != null ? a.getOrden() : 0);
    }

    // Verificar si el usuario autenticado tiene un rol de administrador (ROLE_ADMIN o ROLE_SUPER_ADMIN)
    private boolean esAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority())
                        || "ROLE_SUPER_ADMIN".equals(a.getAuthority()));
    }

    // Extraer la extensión del nombre de archivo original, devolviendo null si no hay extensión
    private String extraerExtension(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) {
            return null;
        }
        return nombreOriginal
                .substring(nombreOriginal.lastIndexOf('.') + 1)
                .toUpperCase();
    }
}
