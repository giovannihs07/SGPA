package com.sgpa.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.config.ProductoTaxonomiaSeeder;
import com.sgpa.dto.response.TaxonomiaEstadoResponse;
import com.sgpa.dto.response.TaxonomiaSeedResponse;
import com.sgpa.repository.CategoriaProductoRepository;
import com.sgpa.repository.SubcategoriaProductoRepository;
import com.sgpa.repository.TipoProductoRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/taxonomia")
@RequiredArgsConstructor
public class TaxonomiaController {

    private final ProductoTaxonomiaSeeder taxonomiaSeeder;
    private final CategoriaProductoRepository categoriaRepository;
    private final SubcategoriaProductoRepository subcategoriaRepository;
    private final TipoProductoRepository tipoProductoRepository;

    /**
     * Indica si ya existe taxonomía y cuántos registros hay en cada nivel.
     */
    @GetMapping("/estado")
    public ResponseEntity<TaxonomiaEstadoResponse> obtenerEstado() {
        long categorias = categoriaRepository.count();
        return ResponseEntity.ok(TaxonomiaEstadoResponse.builder()
            .existe(categorias > 0)
            .categorias(categorias)
            .subcategorias(subcategoriaRepository.count())
            .tipos(tipoProductoRepository.count())
            .build());
    }

    /**
     * Carga la taxonomía predeterminada (MinCiencias / estructura del seeder).
     * Solo permitido cuando aún no hay categorías en la BD.
     */
    @PostMapping("/seed")
    public ResponseEntity<TaxonomiaSeedResponse> cargarPredeterminada() {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(taxonomiaSeeder.seedDefault());
    }
}
