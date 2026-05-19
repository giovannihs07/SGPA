package com.sgpa.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.RegistroDocenteRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.exception.ProgramaNotFoundException;
import com.sgpa.mapper.DocenteMapper;
import com.sgpa.model.Docente;
import com.sgpa.model.Persona;
import com.sgpa.model.Programa;
import com.sgpa.model.TituloAcademico;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.PersonaRepository;
import com.sgpa.repository.ProgramaRepository;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.TituloAcademicoRepository;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocenteServiceImpl implements DocenteService {

    private final DocenteRepository docenteRepository;
    private final PersonaRepository personaRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProgramaRepository programaRepository;
    private final TituloAcademicoRepository tituloRepository;
    private final DocenteMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public DocenteResponse registrar(RegistroDocenteRequest dto) {

        // Validaciones
        if (personaRepository.existsByCedula(dto.getCedula()))
            throw new IllegalStateException(
                "Ya existe una persona con cédula: " + dto.getCedula());

        if (userRepository.existsByEmail(dto.getEmail()))
            throw new IllegalStateException(
                "Ya existe un usuario con email: " + dto.getEmail());

        // 1. Crear Persona
        Persona persona = new Persona();
        persona.setNombre(dto.getNombre());
        persona.setApellido(dto.getApellido());
        persona.setCedula(dto.getCedula());
        persona.setTelefono(dto.getTelefono());
        personaRepository.save(persona);

        // 2. Crear Docente con @MapsId — usa el id de Persona
        Docente docente = new Docente();
        docente.setId(persona.getId());
        docente.setPersona(persona);
        docente.setCodigoDocente(dto.getCodigoDocente());
        docente.setTipoContrato(dto.getTipoContrato());

        // Asignar programas
        if (dto.getProgramaIds() != null && !dto.getProgramaIds().isEmpty()) {
            Set<Programa> programas = new HashSet<>(
                programaRepository.findAllById(dto.getProgramaIds()));
            docente.setProgramas(programas);
        }

        docenteRepository.save(docente);

        // 3. Agregar títulos si vienen en el request
        if (dto.getTitulos() != null && !dto.getTitulos().isEmpty()) {
            List<TituloAcademico> titulos = dto.getTitulos().stream()
                .map(t -> {
                    TituloAcademico titulo = new TituloAcademico();
                    titulo.setTitulo(t.getTitulo());
                    titulo.setNivel(t.getNivel());
                    titulo.setInstitucion(t.getInstitucion());
                    titulo.setFechaObtencion(t.getFechaObtencion());
                    titulo.setPais(t.getPais());
                    titulo.setDocente(docente);
                    return titulo;
                })
                .toList();
            tituloRepository.saveAll(titulos);
        }

        // 4. Crear User con rol ROLE_DOCENTE
        Role rolDocente = roleRepository.findByName(RoleName.ROLE_DOCENTE)
            .orElseThrow(() -> new IllegalStateException(
                "Rol ROLE_DOCENTE no encontrado — insértalo en la BD"));

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setActivo(true);
        user.setPersona(persona);
        user.setRoles(Set.of(rolDocente));
        userRepository.save(user);

        return mapper.toDTO(docenteRepository.findById(docente.getId())
            .orElseThrow());
    }

    @Override
    public DocenteResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    public DocenteResponse buscarPorEmail(String email) {
        return mapper.toDTO(docenteRepository.findByUserEmail(email)
            .orElseThrow(() -> new RuntimeException(
                "Docente no encontrado con email: " + email)));
    }

    @Override
    public List<DocenteResponse> listarTodos() {
        return mapper.toDTOList(docenteRepository.findAll());
    }

    @Override
    public List<DocenteResponse> listarPorPrograma(Long programaId) {
        return mapper.toDTOList(
            docenteRepository.findByProgramaId(programaId));
    }

    @Override
    @Transactional
    public DocenteResponse actualizar(Long id, RegistroDocenteRequest dto) {
        Docente docente = buscarEntidad(id);
        Persona persona = docente.getPersona();

        persona.setNombre(dto.getNombre());
        persona.setApellido(dto.getApellido());
        persona.setCedula(dto.getCedula());
        persona.setTelefono(dto.getTelefono());
        personaRepository.save(persona);

        docente.setCodigoDocente(dto.getCodigoDocente());
        docente.setTipoContrato(dto.getTipoContrato());

        if (dto.getProgramaIds() != null) {
            Set<Programa> programas = new HashSet<>(
                programaRepository.findAllById(dto.getProgramaIds()));
            docente.setProgramas(programas);
        }

        return mapper.toDTO(docenteRepository.save(docente));
    }

    @Override
    @Transactional
    public DocenteResponse agregarTitulo(Long docenteId,
            TituloAcademicoRequest dto) {
        Docente docente = buscarEntidad(docenteId);

        TituloAcademico titulo = new TituloAcademico();
        titulo.setTitulo(dto.getTitulo());
        titulo.setNivel(dto.getNivel());
        titulo.setInstitucion(dto.getInstitucion());
        titulo.setFechaObtencion(dto.getFechaObtencion());
        titulo.setPais(dto.getPais());
        titulo.setDocente(docente);
        tituloRepository.save(titulo);

        return mapper.toDTO(docenteRepository.findById(docenteId).orElseThrow());
    }

    @Override
    @Transactional
    public void eliminarTitulo(Long tituloId) {
        if (!tituloRepository.existsById(tituloId))
            throw new RuntimeException(
                "Título no encontrado con id: " + tituloId);
        tituloRepository.deleteById(tituloId);
    }

    @Override
    @Transactional
    public void activar(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException(
                "Usuario no encontrado con id: " + userId));
        user.setActivo(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void desactivar(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException(
                "Usuario no encontrado con id: " + userId));
        user.setActivo(false);
        userRepository.save(user);
    }

    private Docente buscarEntidad(Long id) {
        return docenteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Docente no encontrado con id: " + id));
    }
}
