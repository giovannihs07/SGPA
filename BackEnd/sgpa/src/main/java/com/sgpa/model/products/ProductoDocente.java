package com.sgpa.model.products;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgpa.model.users.Docente;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
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
    private Boolean publicado = false;

    @CreationTimestamp
    private LocalDate fechaCreacion;

    private LocalDate fechaPublicacion;

    /** Campos legacy — reflejan el archivo Principal para compatibilidad. */
    private String nombreArchivo;
    private String nombreArchivoOriginal;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<ProductoArchivo> archivos = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_producto_id", nullable = false)
    private TipoProducto tipoProducto;  
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> atributos = new HashMap<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    @JsonIgnore
    private Docente docente;
    
    // Valida los atributos requeridos de la BD
    public void validarAtributos() {
        if (tipoProducto == null) return;

        tipoProducto.getAtributos().stream()
            .filter(TipoProductoAtributo::getRequerido)
            .forEach(attr -> {
                String clave = attr.getNombreAtributo();
                if (atributos == null
                        || !atributos.containsKey(clave)
                        || atributos.get(clave) == null
                        || atributos.get(clave).toString().isBlank()) {
                    throw new IllegalArgumentException(
                        "Falta el atributo obligatorio: " + attr.getEtiqueta());
                }
            });
    }
}
