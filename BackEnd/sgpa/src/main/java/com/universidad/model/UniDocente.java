package com.universidad.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "universidad_docentes")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UniDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "persona_id", nullable = false, unique = true)
    private UniPersona persona;

    @Column(name = "codigo_docente", nullable = false, unique = true, length = 30)
    private String codigoDocente;

    @Column(name = "tipo_contrato", nullable = false, length = 50)
    private String tipoContrato;

    @Column(nullable = false)
    private Boolean activo = true;
}
