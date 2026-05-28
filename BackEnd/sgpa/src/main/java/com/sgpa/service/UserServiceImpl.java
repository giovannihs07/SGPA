package com.sgpa.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.ActualizarEmailRequest;
import com.sgpa.dto.response.UserDetalleResponse;
import com.sgpa.dto.response.UserResumenResponse;
import com.sgpa.exception.UsuarioNoPendienteException;
import com.sgpa.mapper.UserDetalleMapper;
import com.sgpa.mapper.UserMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper mapper;
    private final UserDetalleMapper userDetalleMapper;
    private final AuditService auditService;

    @Override
    @Transactional(readOnly = true)
    public List<UserResumenResponse> listarTodos() {
        return mapper.toDTOList(userRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResumenResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    @Transactional
    public void activar(Long userId) {
        User user = buscarEntidad(userId);
        EstadoUsuario anterior = user.getEstado();
        user.setEstado(EstadoUsuario.ACTIVO);
        userRepository.save(user);
        auditService.registrar(ModuloAuditoria.USUARIOS, "ACTIVAR_USUARIO",
                "Activó la cuenta de " + user.getEmail(),
                "User", userId, user.getEmail(),
                Map.of("estadoAnterior", anterior.name()),
                ResultadoAuditoria.EXITOSO);
    }

    @Override
    @Transactional
    public void aprobar(Long userId, Set<String> roles) {
        User user = buscarEntidad(userId);
        verificarPendiente(user, "aprobar");
        asignarRoles(user, roles);
        user.setEstado(EstadoUsuario.ACTIVO);
        userRepository.save(user);
        auditService.registrar(ModuloAuditoria.USUARIOS, "APROBAR_USUARIO",
                "Aprobó el registro de " + user.getEmail(),
                "User", userId, user.getEmail(),
                Map.of("roles", roles),
                ResultadoAuditoria.CRITICO);
    }

    @Override
    @Transactional
    public void desactivar(Long userId) {
        User user = buscarEntidad(userId);
        user.setEstado(EstadoUsuario.INACTIVO);
        userRepository.save(user);
        auditService.registrar(ModuloAuditoria.USUARIOS, "DESACTIVAR_USUARIO",
                "Desactivó la cuenta de " + user.getEmail(),
                "User", userId, user.getEmail(), null,
                ResultadoAuditoria.CRITICO);
    }

    @Override
    @Transactional
    public void rechazar(Long userId) {
        User user = buscarEntidad(userId);
        verificarPendiente(user, "rechazar");
        user.setEstado(EstadoUsuario.RECHAZADO);
        userRepository.save(user);
        auditService.registrar(ModuloAuditoria.USUARIOS, "RECHAZAR_USUARIO",
                "Rechazó el registro de " + user.getEmail(),
                "User", userId, user.getEmail(), null,
                ResultadoAuditoria.CRITICO);
    }

    public List<UserDetalleResponse> listarPorEstado(EstadoUsuario estado) {
        return userDetalleMapper.toDTOList(userRepository.findByEstado(estado));
    }

    @Override
    @Transactional
    public void cambiarRoles(Long userId, Set<String> nuevosRoles) {
        User user = buscarEntidad(userId);
        Set<String> rolesAnteriores = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());
        asignarRoles(user, nuevosRoles);
        userRepository.save(user);
        auditService.registrar(ModuloAuditoria.USUARIOS, "CAMBIAR_ROLES",
                "Cambió roles de " + user.getEmail(),
                "User", userId, user.getEmail(),
                Map.of("rolesAnteriores", rolesAnteriores, "rolesNuevos", nuevosRoles),
                ResultadoAuditoria.CRITICO);
    }

    private void verificarPendiente(User user, String accion) {
        if (user.getEstado() != EstadoUsuario.PENDIENTE) {
            throw new UsuarioNoPendienteException(accion);
        }
    }

    private void asignarRoles(User user, Set<String> nuevosRoles) {
        Set<Role> roles = nuevosRoles.stream()
                .map(nombre -> roleRepository.findByName(RoleName.valueOf(nombre))
                        .orElseThrow(() -> new RuntimeException(
                                "Rol no encontrado: " + nombre)))
                .collect(Collectors.toSet());
        user.setRoles(roles);
    }

    @Override
    @Transactional
    public UserResumenResponse actualizarEmail(Long userId, ActualizarEmailRequest dto) {

        User user = buscarEntidad(userId);

        if (!passwordEncoder.matches(dto.getPasswordActual(), user.getPassword()))
            throw new IllegalArgumentException(
                    "La contraseña actual es incorrecta");

        if (userRepository.existsByEmail(dto.getEmailNuevo()))
            throw new IllegalStateException(
                    "Ya existe un usuario con ese email");

        user.setEmail(dto.getEmailNuevo());
        return mapper.toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public void cambiarPassword(String email, String passwordActual, String passwordNuevo) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(passwordActual, user.getPassword()))
            throw new IllegalArgumentException(
                    "La contraseña actual es incorrecta");

        user.setPassword(passwordEncoder.encode(passwordNuevo));
        userRepository.save(user);
    }

    private User buscarEntidad(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Usuario no encontrado con id: " + id));
    }
}
