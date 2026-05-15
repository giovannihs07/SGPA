package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.AdministrativoRequest;
import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.model.Administrativo;

@Component
public class AdministrativoMapper {

    public AdministrativoResponse toResponse(Administrativo administrativo) {
        return AdministrativoResponse.builder()
            .id(administrativo.getId())
            .nombre(administrativo.getNombre())
            .apellido(administrativo.getApellido())
            .cedula(administrativo.getCedula())
            .telefono(administrativo.getTelefono())
            .cargo(administrativo.getCargo())
            .tipoContrato(administrativo.getTipoContrato())
            .dependencia(administrativo.getDependencia())
            .build();
    }

    public List<AdministrativoResponse> toResponseList(List<Administrativo> administrativos) {
        return administrativos.stream()
            .map(this::toResponse)
            .toList();
    }

    public Administrativo toEntity(AdministrativoRequest request) {
        Administrativo administrativo = new Administrativo();
        administrativo.setNombre(request.getNombre());
        administrativo.setApellido(request.getApellido());
        administrativo.setCedula(request.getCedula());
        administrativo.setTelefono(request.getTelefono());
        administrativo.setCargo(request.getCargo());
        administrativo.setTipoContrato(request.getTipoContrato());
        administrativo.setDependencia(request.getDependencia());
        return administrativo;
    }
}
