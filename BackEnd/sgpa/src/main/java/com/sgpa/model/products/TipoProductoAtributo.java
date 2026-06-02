package com.sgpa.model.products;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tipos_producto_atributos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TipoProductoAtributo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nombre interno del atributo 
    // ej: "doi", "revista", "isbn"
    @Column(name = "nombre_atributo", nullable = false)
    private String nombreAtributo;

    // etiqueta legible para el frontend
    // ej: "DOI", "Nombre de la revista", "ISBN"
    @Column(nullable = false)
    private String etiqueta;

    // tipo de dato para que el frontend sepa qué control mostrar
    // TEXT, NUMBER, DATE, BOOLEAN, SELECT
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_dato", nullable = false)
    private TipoDato tipoDato;

    @Column(nullable = false)
    private Boolean requerido = true;

    // orden de aparición en el formulario
    private Integer orden;

    // para atributos SELECT commo "A1,A2,B,C,D" para clasificación Scimago
    private String opciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_producto_id", nullable = false)
    private TipoProducto tipoProducto;
}
