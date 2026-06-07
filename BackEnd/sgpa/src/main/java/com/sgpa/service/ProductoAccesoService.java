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

    public enum VisorProducto {
        PROPIETARIO, ADMIN, PUBLICO
    }

    private final DocenteRepository docenteRepository;

    public VisorProducto resolverVisor(ProductoDocente producto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth instanceof AnonymousAuthenticationToken) {
            return VisorProducto.PUBLICO;
        }

        if (esAdmin(auth)) {
            return VisorProducto.ADMIN;
        }

        Optional<Docente> docente = docenteRepository.findByUserEmail(auth.getName());
        if (docente.isPresent()
                && producto.getDocente() != null
                && docente.get().getId().equals(producto.getDocente().getId())) {
            return VisorProducto.PROPIETARIO;
        }

        return VisorProducto.PUBLICO;
    }

    public ProductoDocenteResponse aplicarFiltroAcceso(
            ProductoDocenteResponse dto,
            ProductoDocente entidad,
            VisorProducto visor) {

        if (dto == null || entidad == null) {
            return dto;
        }

        List<ProductoArchivo> archivosEntidad = entidad.getArchivos() != null
                ? entidad.getArchivos()
                : List.of();

        return switch (visor) {
            case PROPIETARIO -> aplicarVistaPropietario(dto, archivosEntidad);
            case ADMIN -> aplicarVistaAdmin(dto, archivosEntidad, entidad);
            case PUBLICO -> aplicarVistaPublico(dto, archivosEntidad, entidad);
        };
    }

    public boolean esVisiblePublicamente(ProductoArchivo archivo, List<ProductoArchivo> todos) {
        if (Boolean.TRUE.equals(archivo.getAccesoPublico())) {
            return true;
        }
        return esLegacyPrincipalPublico(archivo, todos);
    }

    public boolean puedeDescargarPublicamente(ProductoArchivo archivo, ProductoDocente producto) {
        if (!Boolean.TRUE.equals(producto.getPublicado())) {
            return false;
        }
        List<ProductoArchivo> archivos = producto.getArchivos() != null
                ? producto.getArchivos()
                : List.of();
        return esVisiblePublicamente(archivo, archivos);
    }

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

    private List<ProductoArchivoResponse> mapearArchivos(
            List<ProductoArchivo> archivosEntidad,
            boolean incluirAccesoPublico,
            boolean descargable) {

        return archivosEntidad.stream()
                .sorted(ordenarPorOrden())
                .map(a -> toArchivoResponse(
                        a,
                        incluirAccesoPublico ? a.getAccesoPublico() : null,
                        descargable))
                .toList();
    }

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

        if (!Boolean.TRUE.equals(entidad.getPublicado())) {
            dto.setNombreArchivo(entidad.getNombreArchivo());
            dto.setNombreArchivoOriginal(entidad.getNombreArchivoOriginal());
            dto.setExtensionArchivo(extraerExtension(entidad.getNombreArchivoOriginal()));
        }
    }

    private boolean esLegacyPrincipalPublico(ProductoArchivo archivo, List<ProductoArchivo> todos) {
        if (archivo.getRol() != RolArchivoProducto.PRINCIPAL) {
            return false;
        }
        return todos.stream().noneMatch(a -> Boolean.TRUE.equals(a.getAccesoPublico()));
    }

    private long contarRestringidos(List<ProductoArchivo> archivos) {
        return archivos.stream()
                .filter(a -> !Boolean.TRUE.equals(a.getAccesoPublico()))
                .count();
    }

    private Comparator<ProductoArchivo> ordenarPorOrden() {
        return Comparator.comparing(a -> a.getOrden() != null ? a.getOrden() : 0);
    }

    private boolean esAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority())
                        || "ROLE_SUPER_ADMIN".equals(a.getAuthority()));
    }

    private String extraerExtension(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) {
            return null;
        }
        return nombreOriginal
                .substring(nombreOriginal.lastIndexOf('.') + 1)
                .toUpperCase();
    }
}
