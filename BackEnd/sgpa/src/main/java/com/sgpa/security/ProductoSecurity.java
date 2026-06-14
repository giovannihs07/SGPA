package com.sgpa.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.ProductoDocenteRepository;

import lombok.RequiredArgsConstructor;

// Componente para verificar si el usuario es propietario de un producto
@Component("productoSecurity")
@RequiredArgsConstructor
public class ProductoSecurity {

    private final ProductoDocenteRepository productoRepository;
    private final DocenteRepository docenteRepository;

    public boolean esPropietario(Long productoId) {
        if (productoId == null) {
            return false;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth instanceof AnonymousAuthenticationToken) {
            return false;
        }

        return docenteRepository.findByUserEmail(auth.getName())
                .map(docente -> productoRepository.findById(productoId)
                        .map(producto -> producto.getDocente() != null
                                && producto.getDocente().getId().equals(docente.getId()))
                        .orElse(false))
                .orElse(false);
    }
}
