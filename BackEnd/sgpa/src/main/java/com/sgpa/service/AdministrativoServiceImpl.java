package com.sgpa.service;

import java.util.List;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sgpa.dto.request.RegistroAdministrativoRequest;
import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.mapper.AdministrativoMapper;
import com.sgpa.model.Administrativo;
import com.sgpa.model.Persona;
import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;
import com.sgpa.repository.AdministrativoRepository;
import com.sgpa.repository.PersonaRepository;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdministrativoServiceImpl implements AdministrativoService {

    private final AdministrativoRepository administrativoRepository;
    private final PersonaRepository personaRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AdministrativoMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public AdministrativoResponse registrar(
            RegistroAdministrativoRequest dto) {

        if (personaRepository.existsByCedula(dto.getCedula()))
            throw new IllegalStateException(
                "Ya existe una persona con cédula: " + dto.getCedula());

        if (userRepository.existsByEmail(dto.getEmail()))
            throw new IllegalStateException(
                "Ya existe un usuario con email: " + dto.getEmail());

        // 1. Crear y guardar Persona
        Persona persona = new Persona();
        persona.setNombre(dto.getNombre());
        persona.setApellido(dto.getApellido());
        persona.setCedula(dto.getCedula());
        persona.setTelefono(dto.getTelefono());
        persona = personaRepository.save(persona);

        // 2. Crear Administrativo — @MapsId toma el id de persona
        Administrativo administrativo = new Administrativo();
        administrativo.setPersona(persona);
        administrativo.setCargo(dto.getCargo());
        administrativo.setDependencia(dto.getDependencia());
        administrativo = administrativoRepository.save(administrativo);

        // 3. Crear User con rol ROLE_ADMIN
        Role rolAdmin = roleRepository.findByName(RoleName.ROLE_ADMIN)
            .orElseThrow(() -> new IllegalStateException(
                "Rol ROLE_ADMIN no encontrado"));

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEstado(EstadoUsuario.PENDIENTE);
        user.setPersona(persona);
        user.setRoles(Set.of(rolAdmin));
        userRepository.save(user);

        Administrativo guardado = administrativoRepository
            .findById(administrativo.getId()).orElseThrow();

        return mapper.toDTO(guardado, user);
    }

    @Override
    public AdministrativoResponse buscarPorId(Long id) {
        return mapper.toDTO(buscarEntidad(id));
    }

    @Override
    public List<AdministrativoResponse> listarTodos() {
        return mapper.toDTOList(administrativoRepository.findAll());
    }

    @Override
    public List<AdministrativoResponse> listarPorDependencia(String dependencia) {
        return mapper.toDTOList(administrativoRepository.findByDependencia(dependencia));
    }

    @Override
    @Transactional
    public AdministrativoResponse actualizar(Long id, RegistroAdministrativoRequest dto) {
        Administrativo administrativo = buscarEntidad(id);
        Persona persona = administrativo.getPersona();

        persona.setNombre(dto.getNombre());
        persona.setApellido(dto.getApellido());
        persona.setCedula(dto.getCedula());
        persona.setTelefono(dto.getTelefono());
        personaRepository.save(persona);

        administrativo.setCargo(dto.getCargo());
        administrativo.setDependencia(dto.getDependencia());

        return mapper.toDTO(administrativoRepository.save(administrativo));
    }

    private Administrativo buscarEntidad(Long id) {
        return administrativoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(
                "Administrativo no encontrado con id: " + id));
    }
}
