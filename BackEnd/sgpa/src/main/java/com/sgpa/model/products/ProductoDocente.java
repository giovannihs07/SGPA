package com.sgpa.model.products;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.sgpa.model.Docente;

//import com.proyectogrado.sgpa.converter.MapToJsonConverter;

import jakarta.persistence.Column;
//import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProductoDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;

    // Para almacenar el nombre del archivo asociado al producto, puede ser opcional
    private String nombreArchivo;
    private String nombreArchivoOriginal;

    private Boolean publicado;

    @Enumerated(EnumType.STRING)
    private CategoriaProducto categoria;

    @Enumerated(EnumType.STRING)
    private SubcategoriaProducto subcategoria;

    @Enumerated(EnumType.STRING)
    private TipoProducto tipo;

    @CreationTimestamp
    private LocalDate fechaCreacion;

    // Para almacenar la fecha cuando RRHH lo publique
    private LocalDate fechaPublicacion;

    // Conectarse a la base de datos PostgreSQL
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> atributos = new HashMap<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Docente docente;

    // Conectarse a la base de datos H2
    /*
     * @Convert(converter = MapToJsonConverter.class)
     * 
     * @Column(columnDefinition = "TEXT")
     * private Map<String, Object> atributos = new HashMap<>();
     */
}
