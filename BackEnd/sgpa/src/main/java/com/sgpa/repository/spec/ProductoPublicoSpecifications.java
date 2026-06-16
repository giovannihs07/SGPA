package com.sgpa.repository.spec;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.sgpa.model.institucion.Facultad;
import com.sgpa.model.institucion.Programa;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.users.Docente;
import com.sgpa.model.users.Persona;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public final class ProductoPublicoSpecifications {

    private static final String CAMPO_FECHA_PUBLICACION = "fechaPublicacionSgpa";
    private static final String CAMPO_FECHA_REGISTRO = "fechaRegistroSgpa";

    private ProductoPublicoSpecifications() {
    }

    public static Specification<ProductoDocente> publicadosConFiltros(
            String q,
            String categoria,
            String subcategoria,
            String tipo,
            Long facultadId,
            Long programaId,
            LocalDate desde,
            LocalDate hasta,
            String campoFecha) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("publicado")));

            if (q != null && !q.isBlank()) {
                Join<ProductoDocente, Docente> docente = root.join("docente", JoinType.INNER);
                Join<Docente, Persona> persona = docente.join("persona", JoinType.INNER);
                String term = "%" + q.toLowerCase().trim() + "%";
                Expression<String> nombrePersona = cb.coalesce(persona.get("nombre"), "");
                Expression<String> apellidoPersona = cb.coalesce(persona.get("apellido"), "");
                Expression<String> nombreCompleto = cb.lower(
                        cb.concat(cb.concat(nombrePersona, " "), apellidoPersona));
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nombre")), term),
                        cb.like(cb.lower(root.get("descripcion")), term),
                        cb.like(cb.lower(docente.get("codigoDocente")), term),
                        cb.like(cb.lower(nombrePersona), term),
                        cb.like(cb.lower(apellidoPersona), term),
                        cb.like(nombreCompleto, term)));
            }

            Join<ProductoDocente, TipoProducto> tipoJoin = null;
            if ((categoria != null && !categoria.isBlank())
                    || (subcategoria != null && !subcategoria.isBlank())
                    || (tipo != null && !tipo.isBlank())) {
                tipoJoin = root.join("tipoProducto", JoinType.INNER);
            }

            if (tipo != null && !tipo.isBlank()) {
                if (tipoJoin == null) {
                    tipoJoin = root.join("tipoProducto", JoinType.INNER);
                }
                predicates.add(cb.equal(tipoJoin.get("nombre"), tipo));
            }

            if (subcategoria != null && !subcategoria.isBlank()) {
                if (tipoJoin == null) {
                    tipoJoin = root.join("tipoProducto", JoinType.INNER);
                }
                Join<TipoProducto, SubcategoriaProducto> subJoin =
                        tipoJoin.join("subcategoria", JoinType.INNER);
                predicates.add(cb.equal(subJoin.get("nombre"), subcategoria));
            }

            if (categoria != null && !categoria.isBlank()) {
                if (tipoJoin == null) {
                    tipoJoin = root.join("tipoProducto", JoinType.INNER);
                }
                Join<TipoProducto, SubcategoriaProducto> subJoin =
                        tipoJoin.join("subcategoria", JoinType.INNER);
                Join<SubcategoriaProducto, CategoriaProducto> catJoin =
                        subJoin.join("categoria", JoinType.INNER);
                predicates.add(cb.equal(catJoin.get("nombre"), categoria));
            }

            if (facultadId != null || programaId != null) {
                Join<ProductoDocente, Docente> docenteJoin = root.join("docente", JoinType.INNER);
                Join<Docente, Programa> programaJoin = docenteJoin.join("programas", JoinType.INNER);
                if (programaId != null) {
                    predicates.add(cb.equal(programaJoin.get("id"), programaId));
                }
                if (facultadId != null) {
                    Join<Programa, Facultad> facultadJoin = programaJoin.join("facultad", JoinType.INNER);
                    predicates.add(cb.equal(facultadJoin.get("id"), facultadId));
                }
            }

            if (desde != null || hasta != null) {
                String campo = resolverCampoFecha(campoFecha);
                if (desde != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get(campo), desde));
                }
                if (hasta != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get(campo), hasta));
                }
            }

            if (query != null) {
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<ProductoDocente> ultimos30Dias(String campoFecha) {
        LocalDate limite = LocalDate.now().minusDays(30);
        String campo = resolverCampoFecha(campoFecha);
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(campo), limite);
    }

    private static String resolverCampoFecha(String campoFecha) {
        if (CAMPO_FECHA_REGISTRO.equals(campoFecha)) {
            return CAMPO_FECHA_REGISTRO;
        }
        return CAMPO_FECHA_PUBLICACION;
    }
}
