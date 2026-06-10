package com.sgpa.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.ActualizarEmailRequest;
import com.sgpa.dto.request.ActualizarPerfilAdministrativoRequest;
import com.sgpa.dto.request.ActualizarPerfilDocenteRequest;
import com.sgpa.dto.request.ActualizarPerfilProgramasRequest;
import com.sgpa.dto.request.ActualizarPerfilRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.model.institucion.Programa;
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
    public List<UserResumenResponse> listarTodos() {
        return mapper.toDTOList(userRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResumenResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetalleResponse obtenerPerfil(String email) {
        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
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
    public UserDetalleResponse actualizarPerfilDocente(String email, ActualizarPerfilDocenteRequest dto) {
        Docente docente = buscarDocentePorEmail(email);
        docente.setTipoContrato(dto.getTipoContrato().trim());
        docenteRepository.save(docente);
        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
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
    public UserDetalleResponse actualizarPerfilAdministrativo(String email, ActualizarPerfilAdministrativoRequest dto) {
        Administrativo administrativo = buscarAdministrativoPorEmail(email);
        administrativo.setCargo(dto.getCargo().trim());
        administrativo.setDependencia(dto.getDependencia().trim());
        administrativoRepository.save(administrativo);
        return detalleMapper.toDTO(buscarPorEmail(email));
    }

    @Override
    @Transactional
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
