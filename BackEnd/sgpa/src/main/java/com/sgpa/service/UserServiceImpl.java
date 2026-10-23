package com.sgpa.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.ActualizarEmailRequest;
import com.sgpa.dto.request.ActualizarPerfilAdministrativoRequest;
import com.sgpa.dto.request.ActualizarPerfilDocenteRequest;
import com.sgpa.dto.request.ActualizarPerfilProgramasRequest;
import com.sgpa.dto.request.ActualizarPerfilRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.UserDetalleResponse;
import com.sgpa.dto.response.UserResumenResponse;
import com.sgpa.exception.UserNotFoundException;
import com.sgpa.mapper.UserDetalleMapper;
import com.sgpa.mapper.UserMapper;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.users.Administrativo;
import com.sgpa.model.users.Docente;
import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.model.users.Persona;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.TituloAcademico;
import com.sgpa.model.users.User;
import com.sgpa.repository.AdministrativoRepository;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.ProgramaRepository;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.TituloAcademicoRepository;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Set<RoleName> ROLES_ASIGNABLES_PANEL = Set.of(
            RoleName.ROLE_DOCENTE,
            RoleName.ROLE_ADMIN);

    private final UserRepository userRepository;
    private final DocenteRepository docenteRepository;
    private final AdministrativoRepository administrativoRepository;
    private final ProgramaRepository programaRepository;
    private final TituloAcademicoRepository tituloRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper mapper;
    private final UserDetalleMapper detalleMapper;
    private final AuditService auditService;

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<UserResumenResponse> listarTodos() {
        return mapper.toDTOList(userRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public UserResumenResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserDetalleResponse obtenerPerfil(String email) {
        User user = buscarPorEmail(email);
        sincronizarPerfilesConRoles(user, nombresRoles(user));
        return detalleMapper.toDTO(user);
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserDetalleResponse actualizarPerfil(String email, ActualizarPerfilRequest dto) {
        User user = buscarPorEmail(email);
        Persona persona = user.getPersona();

        if (persona == null) {
            throw new IllegalStateException("El usuario no tiene datos de persona asociados");
        }

        persona.setNombre(dto.getNombre().trim());
        persona.setApellido(dto.getApellido().trim());
        persona.setTelefono(dto.getTelefono() != null ? dto.getTelefono().trim() : null);

        return detalleMapper.toDTO(user);
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserDetalleResponse actualizarPerfilDocente(String email, ActualizarPerfilDocenteRequest dto) {
        Docente docente = buscarDocentePorEmail(email);
        docente.setTipoContrato(dto.getTipoContrato().trim());
        asignarCodigoDocenteSiPendiente(docente, dto.getCodigoDocente());
        docenteRepository.save(docente);
        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserDetalleResponse actualizarProgramasPerfil(String email, ActualizarPerfilProgramasRequest dto) {
        Docente docente = buscarDocentePorEmail(email);
        Set<Long> programaIds = dto.getProgramaIds();

        if (programaIds == null || programaIds.isEmpty()) {
            throw new IllegalArgumentException("Debe tener al menos un programa asignado");
        }

        var programas = programaRepository.findAllById(programaIds);
        if (programas.size() != programaIds.size()) {
            throw new IllegalArgumentException("Uno o más programas no son válidos");
        }

        docente.setProgramas(new HashSet<>(programas));
        docenteRepository.save(docente);
        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserDetalleResponse actualizarPerfilAdministrativo(String email, ActualizarPerfilAdministrativoRequest dto) {
        Administrativo administrativo = buscarAdministrativoPorEmail(email);
        administrativo.setCargo(dto.getCargo().trim());
        administrativo.setDependencia(dto.getDependencia().trim());
        administrativoRepository.save(administrativo);
        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserDetalleResponse agregarTituloPerfil(String email, TituloAcademicoRequest dto) {
        Docente docente = buscarDocentePorEmail(email);

        TituloAcademico titulo = new TituloAcademico();
        titulo.setTitulo(dto.getTitulo().trim());
        titulo.setNivel(dto.getNivel());
        titulo.setInstitucion(dto.getInstitucion().trim());
        titulo.setFechaObtencion(dto.getFechaObtencion());
        titulo.setPais(dto.getPais() != null ? dto.getPais().trim() : null);
        titulo.setDocente(docente);
        tituloRepository.save(titulo);

        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserDetalleResponse eliminarTituloPerfil(String email, Long tituloId) {
        Docente docente = buscarDocentePorEmail(email);
        TituloAcademico titulo = tituloRepository.findById(tituloId)
                .orElseThrow(() -> new IllegalArgumentException("Título no encontrado"));

        if (!titulo.getDocente().getId().equals(docente.getId())) {
            throw new IllegalArgumentException("No tienes permiso para eliminar este título");
        }

        tituloRepository.delete(titulo);
        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public void activar(Long userId) {
        User user = buscarEntidad(userId);
        verificarNoEsSuperAdmin(user, "No se puede cambiar el estado de una cuenta Super Admin");
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public void desactivar(Long userId) {
        User user = buscarEntidad(userId);
        verificarNoEsSuperAdmin(user, "No se puede cambiar el estado de una cuenta Super Admin");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && user.getEmail().equalsIgnoreCase(auth.getName())) {
            throw new IllegalArgumentException("No puedes desactivar tu propia cuenta");
        }

        user.setEstado(EstadoUsuario.INACTIVO);
        userRepository.save(user);
        auditService.registrar(ModuloAuditoria.USUARIOS, "DESACTIVAR_USUARIO",
                "Desactivó la cuenta de " + user.getEmail(),
                "User", userId, user.getEmail(), null,
                ResultadoAuditoria.CRITICO);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public void cambiarRoles(Long userId, Set<String> nuevosRoles) {
        User user = buscarEntidad(userId);
        verificarNoEsSuperAdmin(user, "No se pueden modificar los roles de una cuenta Super Admin");

        validarRolesAsignables(nuevosRoles);

        Set<String> rolesAnteriores = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());
        asignarRoles(user, nuevosRoles);
        sincronizarPerfilesConRoles(user, nuevosRoles);
        userRepository.save(user);
        auditService.registrar(ModuloAuditoria.USUARIOS, "CAMBIAR_ROLES",
                "Cambió roles de " + user.getEmail(),
                "User", userId, user.getEmail(),
                Map.of("rolesAnteriores", rolesAnteriores, "rolesNuevos", nuevosRoles),
                ResultadoAuditoria.CRITICO);
    }

    // Las cuentas Super Admin solo se protegían en la interfaz; aquí se blindan también en la API
    private void verificarNoEsSuperAdmin(User user, String mensaje) {
        if (user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_SUPER_ADMIN)) {
            throw new IllegalArgumentException(mensaje);
        }
    }

    private void validarRolesAsignables(Set<String> nuevosRoles) {
        if (nuevosRoles == null || nuevosRoles.isEmpty()) {
            throw new IllegalArgumentException("Debe asignar al menos un rol");
        }

        for (String rol : nuevosRoles) {
            final RoleName roleName;
            try {
                roleName = RoleName.valueOf(rol);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Rol inválido: " + rol);
            }
            if (!ROLES_ASIGNABLES_PANEL.contains(roleName)) {
                throw new IllegalArgumentException(
                        "Solo se pueden asignar los roles Docente y Administrativo");
            }
        }
    }

    private void asignarRoles(User user, Set<String> nuevosRoles) {
        Set<Role> roles = nuevosRoles.stream()
                .map(nombre -> roleRepository.findByName(RoleName.valueOf(nombre))
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Rol no válido: " + nombre)))
                .collect(Collectors.toSet());
        user.setRoles(roles);
    }

    private void sincronizarPerfilesConRoles(User user, Set<String> nuevosRoles) {
        Persona persona = user.getPersona();
        if (persona == null) {
            throw new IllegalStateException("El usuario no tiene datos de persona asociados");
        }

        Set<RoleName> roles = nuevosRoles.stream()
                .map(RoleName::valueOf)
                .collect(Collectors.toSet());

        if (roles.contains(RoleName.ROLE_ADMIN)
                && administrativoRepository.findById(persona.getId()).isEmpty()) {
            Administrativo administrativo = new Administrativo();
            administrativo.setPersona(persona);
            administrativoRepository.save(administrativo);
        }

        if (roles.contains(RoleName.ROLE_DOCENTE)
                && docenteRepository.findById(persona.getId()).isEmpty()) {
            Docente docente = new Docente();
            docente.setPersona(persona);
            docente.setProgramas(new HashSet<>());
            docenteRepository.save(docente);
        }
    }

    private Set<String> nombresRoles(User user) {
        return user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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
    @PreAuthorize("isAuthenticated()")
    public void cambiarPassword(String email, String passwordActual, String passwordNuevo) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        if (!passwordEncoder.matches(passwordActual, user.getPassword()))
            throw new IllegalArgumentException(
                    "La contraseña actual es incorrecta");

        user.setPassword(passwordEncoder.encode(passwordNuevo));
        userRepository.save(user);
    }

    private User buscarEntidad(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    private User buscarPorEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    private Docente buscarDocentePorEmail(String email) {
        User user = buscarPorEmail(email);
        Persona persona = user.getPersona();
        if (persona == null) {
            throw new IllegalStateException("El usuario no tiene datos de persona asociados");
        }
        return docenteRepository.findById(persona.getId())
                .orElseThrow(() -> new IllegalStateException("El usuario no tiene perfil docente"));
    }

    private void asignarCodigoDocenteSiPendiente(Docente docente, String codigoNuevo) {
        String actual = docente.getCodigoDocente();
        if (actual != null && !actual.isBlank()) {
            return;
        }
        if (codigoNuevo == null || codigoNuevo.isBlank()) {
            throw new IllegalArgumentException("El código docente es obligatorio");
        }
        String codigo = codigoNuevo.trim();
        docenteRepository.findByCodigoDocente(codigo)
                .filter(otro -> !otro.getId().equals(docente.getId()))
                .ifPresent(otro -> {
                    throw new IllegalStateException("Ya existe un docente con ese código");
                });
        docente.setCodigoDocente(codigo);
    }

    private Administrativo buscarAdministrativoPorEmail(String email) {
        User user = buscarPorEmail(email);
        Persona persona = user.getPersona();
        if (persona == null) {
            throw new IllegalStateException("El usuario no tiene datos de persona asociados");
        }
        return administrativoRepository.findById(persona.getId())
                .orElseThrow(() -> new IllegalStateException("El usuario no tiene perfil administrativo"));
    }
}
