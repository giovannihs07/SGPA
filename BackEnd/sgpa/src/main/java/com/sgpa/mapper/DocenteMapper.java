package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.dto.response.DocenteResponse.ProgramaDocenteDTO;
import com.sgpa.model.Docente;

@Component
public class DocenteMapper {

    /**
     * Convierte una entidad Docente a DocenteResponse
     * Incluye la lista de programas asociados
     */
    public DocenteResponse toResponse(Docente docente) {
        if (docente == null) {
            return null;
        }
        
        List<ProgramaDocenteDTO> programas = docente.getProgramas() != null
            ? docente.getProgramas().stream()
                .map(programa -> ProgramaDocenteDTO.builder()
                    .id(programa.getId())
                    .nombre(programa.getNombre())
                    .codigo(programa.getCodigo())
                    .nivel(programa.getNivel())
                    .build())
                .collect(Collectors.toList())
            : List.of();
        
        return DocenteResponse.builder()
            .id(docente.getId())
            .nombre(docente.getNombre())
            .apellido(docente.getApellido())
            .cedula(docente.getCedula())
            .telefono(docente.getTelefono())
            .codigoDocente(docente.getCodigoDocente())
            .titulos(docente.getTitulos())
            .tipoContrato(docente.getTipoContrato())
            .programas(programas)
            .build();
    }

    /**
     * Convierte una lista de Docentes a lista de DocenteResponse
     */
    public List<DocenteResponse> toResponseList(List<Docente> docentes) {
        if (docentes == null) {
            return List.of();
        }
        
        return docentes.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    /**
     * Convierte un DocenteRequest a una entidad Docente
     * Nota: Los programas se asignan en el Service
     */
    public Docente toEntity(DocenteRequest request) {
        if (request == null) {
            return null;
        }
        
        Docente docente = new Docente();
        docente.setNombre(request.getNombre());
        docente.setApellido(request.getApellido());
        docente.setCedula(request.getCedula());
        docente.setTelefono(request.getTelefono());
        docente.setCodigoDocente(request.getCodigoDocente());
        docente.setTitulos(request.getTitulos());
        docente.setTipoContrato(request.getTipoContrato());
        return docente;
    }
}
