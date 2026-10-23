package com.sgpa.config;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.response.TaxonomiaSeedResponse;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoDato;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.products.TipoProductoAtributo;
import com.sgpa.repository.CategoriaProductoRepository;
import com.sgpa.repository.SubcategoriaProductoRepository;
import com.sgpa.repository.TipoProductoRepository;
import com.sgpa.service.AuditService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductoTaxonomiaSeeder {

    private static final Logger log = LoggerFactory.getLogger(ProductoTaxonomiaSeeder.class);

    private final CategoriaProductoRepository categoriaRepository;
    private final SubcategoriaProductoRepository subcategoriaRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final AuditService auditService;

    public boolean exists() {
        return categoriaRepository.count() > 0;
    }

    /**
     * Carga la taxonomía predeterminada. Invocado desde el panel de superadmin.
     */
    @Transactional
    public TaxonomiaSeedResponse seedDefault() {
        if (exists())
            throw new IllegalStateException(
                "La taxonomía ya existe. Use la configuración manual para editarla.");

        log.info("Sembrando taxonomía de productos académicos…");

        Map<String, CategoriaProducto> categorias = seedCategorias();
        Map<String, SubcategoriaProducto> subcategorias = seedSubcategorias(categorias);
        int tiposCreados = seedTipos(subcategorias);

        log.info(
            "Taxonomía sembrada: {} categorías, {} subcategorías, {} tipos",
            categorias.size(),
            subcategorias.size(),
            tiposCreados
        );

        auditService.registrar(ModuloAuditoria.CONFIGURACION, "CARGAR_TAXONOMIA_PREDETERMINADA",
                "Cargó la taxonomía predeterminada de productos",
                "Taxonomia", null, "Taxonomía predeterminada",
                Map.of("categorias", categorias.size(),
                        "subcategorias", subcategorias.size(),
                        "tipos", tiposCreados),
                ResultadoAuditoria.EXITOSO);

        return TaxonomiaSeedResponse.builder()
            .categorias(categorias.size())
            .subcategorias(subcategorias.size())
            .tipos(tiposCreados)
            .mensaje("Taxonomía predeterminada cargada correctamente")
            .build();
    }

    private Map<String, CategoriaProducto> seedCategorias() {
        Map<String, CategoriaProducto> map = new HashMap<>();

        ProductoTaxonomiaSeedData.CATEGORIA_LABELS.forEach((key, nombre) -> {
            CategoriaProducto categoria = new CategoriaProducto();
            categoria.setNombre(nombre);
            categoria.setActivo(true);
            map.put(key, categoriaRepository.save(categoria));
        });

        return map;
    }

    private Map<String, SubcategoriaProducto> seedSubcategorias(
            Map<String, CategoriaProducto> categorias) {

        Map<String, SubcategoriaProducto> map = new HashMap<>();

        ProductoTaxonomiaSeedData.SUBCATEGORIA_LABELS.forEach((key, nombre) -> {
            String categoriaKey = ProductoTaxonomiaSeedData
                .SUBCATEGORIA_A_CATEGORIA.get(key);
            CategoriaProducto categoria = categorias.get(categoriaKey);

            SubcategoriaProducto subcategoria = new SubcategoriaProducto();
            subcategoria.setNombre(nombre);
            subcategoria.setActivo(true);
            subcategoria.setCategoria(categoria);
            map.put(key, subcategoriaRepository.save(subcategoria));
        });

        return map;
    }

    private int seedTipos(Map<String, SubcategoriaProducto> subcategorias) {
        int count = 0;

        for (String entry : ProductoTaxonomiaSeedData.TIPOS) {
            String[] parts = entry.split("\\|", 3);
            String subcategoriaKey = parts[0];
            String nombreTipo = parts[1];
            String[] atributos = parts[2].split(",");

            SubcategoriaProducto subcategoria = subcategorias.get(subcategoriaKey);
            if (subcategoria == null)
                throw new IllegalStateException(
                    "Subcategoría desconocida en seed: " + subcategoriaKey);

            TipoProducto tipo = new TipoProducto();
            tipo.setNombre(nombreTipo);
            tipo.setActivo(true);
            tipo.setSubcategoria(subcategoria);

            for (int i = 0; i < atributos.length; i++) {
                String nombreAtributo = atributos[i].trim();
                TipoProductoAtributo atributo = new TipoProductoAtributo();
                atributo.setNombreAtributo(nombreAtributo);
                atributo.setEtiqueta(
                    ProductoTaxonomiaSeedData.ATRIBUTO_LABELS
                        .getOrDefault(nombreAtributo, nombreAtributo));
                atributo.setTipoDato(inferirTipoDato(nombreAtributo));
                atributo.setRequerido(true);
                atributo.setOrden(i + 1);
                if ("clasificacion".equals(nombreAtributo))
                    atributo.setOpciones(ProductoTaxonomiaSeedData.CLASIFICACION_OPCIONES);
                atributo.setTipoProducto(tipo);
                tipo.getAtributos().add(atributo);
            }

            tipoProductoRepository.save(tipo);
            count++;
        }

        return count;
    }

    private TipoDato inferirTipoDato(String nombreAtributo) {
        if ("clasificacion".equals(nombreAtributo))
            return TipoDato.SELECT;
        if (ProductoTaxonomiaSeedData.ATRIBUTOS_FECHA.contains(nombreAtributo))
            return TipoDato.DATE;
        if (ProductoTaxonomiaSeedData.ATRIBUTOS_NUMERO.contains(nombreAtributo))
            return TipoDato.NUMBER;
        return TipoDato.TEXT;
    }
}
