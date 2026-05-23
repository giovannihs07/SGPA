package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.UserDetalleResponse;
import com.sgpa.model.Administrativo;
import com.sgpa.model.Docente;
import com.sgpa.model.Persona;
import com.sgpa.model.users.User;
import com.sgpa.repository.AdministrativoRepository;
import com.sgpa.repository.DocenteRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserDetalleMapper {

    private final DocenteRepository docenteRepository;
    private final AdministrativoRepository administrativoRepository;

    public UserDetalleResponse toDTO(User user) {
        Persona persona = user.getPersona();

        // Busca perfil docente si existe
        Docente docente = persona != null
            ? docenteRepository.findById(persona.getId()).orElse(null)
            : null;

        // Busca perfil administrativo si existe
        Administrativo admin = persona != null
            ? administrativoRepository.findById(persona.getId()).orElse(null)
            : null;

        return UserDetalleResponse.builder()
            .userId(user.getId())
            .email(user.getEmail())
            .estado(user.getEstado().name())
            .roles(user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet()))
            .fechaRegistro(persona != null ? persona.getFechaCreacion() : null)
            .nombre(persona != null ? persona.getNombre() : null)
            .apellido(persona != null ? persona.getApellido() : null)
            .cedula(persona != null ? persona.getCedula() : null)
            .telefono(persona != null ? persona.getTelefono() : null)
            .docenteId(docente != null ? docente.getId() : null)
            .codigoDocente(docente != null ? docente.getCodigoDocente() : null)
            .tipoContratoDocente(docente != null ? docente.getTipoContrato() : null)
            .administrativoId(admin != null ? admin.getId() : null)
            .cargo(admin != null ? admin.getCargo() : null)
            .dependencia(admin != null ? admin.getDependencia() : null)
            .build();
    }

    public List<UserDetalleResponse> toDTOList(List<User> users) {
        return users.stream().map(this::toDTO).toList();
    }
}
