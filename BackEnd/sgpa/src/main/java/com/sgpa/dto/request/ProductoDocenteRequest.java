package com.sgpa.dto.request;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductoDocenteRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El tipo de producto es obligatorio")
    private Long tipoProductoId; 

    @NotNull(message = "Los atributos son obligatorios")
    private Map<String, Object> atributos;

    /** Metadatos de archivos nuevos (mismo orden que la parte multipart "archivos"). */
    private List<ProductoArchivoMetaRequest> archivosMeta;

    /** IDs de archivos existentes a eliminar (solo en actualización). */
    private List<Long> archivosEliminarIds;
}
