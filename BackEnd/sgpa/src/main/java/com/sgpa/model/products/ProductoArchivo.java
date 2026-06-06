package com.sgpa.model.products;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "productos_archivos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProductoArchivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnore
    private ProductoDocente producto;

    @Column(name = "nombre_interno", nullable = false)
    private String nombreInterno;

    @Column(name = "nombre_original", nullable = false)
    private String nombreOriginal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolArchivoProducto rol;

    private Integer orden;

    @CreationTimestamp
    @Column(name = "fecha_subida")
    private LocalDateTime fechaSubida;
}
