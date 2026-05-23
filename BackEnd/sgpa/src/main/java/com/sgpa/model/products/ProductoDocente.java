package com.sgpa.model.products;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgpa.model.Docente;

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

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos_docentes")
public class ProductoDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;

    // Para almacenar el nombre del archivo asociado al producto, puede ser opcional
    private String nombreArchivo;
    private String nombreArchivoOriginal;

    private Boolean publicado = false;

    @Enumerated(EnumType.STRING)
    private TipoProducto tipo;

    @CreationTimestamp
    private LocalDate fechaCreacion;

    private LocalDate fechaPublicacion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> atributos = new HashMap<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    @JsonIgnore
    private Docente docente;
    
    public void validarAtributos() {
        List<String> requeridos = tipo.getAtributosRequeridos();

        for (String atributo: requeridos) {
            if (atributos == null || !atributos.containsKey(atributo) || atributos.get(atributo) == null || atributos.get(atributo).toString().isBlank()) {
                throw new IllegalArgumentException("Falta el atributo obligatorio: " + atributo);
            }
        }
    }
}
