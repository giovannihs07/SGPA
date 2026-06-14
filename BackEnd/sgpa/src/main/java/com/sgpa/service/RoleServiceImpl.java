package com.sgpa.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.RoleRequest;
import com.sgpa.dto.response.RoleResponse;
import com.sgpa.mapper.RoleMapper;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> listarTodos() {
        return mapper.toDTOList(roleRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    @Transactional
    public RoleResponse crear(RoleRequest request) {
        validarNombreRol(request.getNombre().name());
        Role role = mapper.toEntity(request);
        role = roleRepository.save(role);
        return mapper.toDTO(role);
    }

    @Override
    @Transactional
    public RoleResponse actualizar(Long id, RoleRequest request) {
        Role role = buscarEntidad(id);
        mapper.updateEntity(request, role);
        role = roleRepository.save(role);
        return mapper.toDTO(role);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Role role = buscarEntidad(id);
        roleRepository.delete(role);
    }

    private Role buscarEntidad(Long id) {
        return roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Rol no encontrado con id: " + id));
    }

    private void validarNombreRol(String nombreRol) {
        try {
            RoleName.valueOf(nombreRol);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Rol inválido: " + nombreRol + 
                ". Roles válidos: ROLE_DOCENTE, ROLE_ADMIN, ROLE_SUPER_ADMIN");
        }
    }
}
