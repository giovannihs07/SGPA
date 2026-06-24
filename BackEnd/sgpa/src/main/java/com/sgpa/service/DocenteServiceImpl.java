package com.sgpa.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.RegistroAdminParaDocenteRequest;
import com.sgpa.dto.request.RegistroDocenteRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.dto.response.DocenteAdministrativoResponse;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.exception.DocenteNotFoundException;
import com.sgpa.exception.UniversidadValidationException;
import com.sgpa.mapper.AdministrativoMapper;
import com.sgpa.mapper.DocenteMapper;
import com.sgpa.model.institucion.Programa;
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
import com.sgpa.repository.PersonaRepository;
import com.sgpa.repository.ProgramaRepository;
import com.sgpa.repository.RoleRepository;
import com.sgpa.repository.TituloAcademicoRepository;
import com.sgpa.repository.UserRepository;
import com.universidad.service.UniversidadService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocenteServiceImpl implements DocenteService {

    private final DocenteRepository docenteRepository;
    private final PersonaRepository personaRepository;
    private final AdministrativoRepository administrativoRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProgramaRepository programaRepository;
    private final TituloAcademicoRepository tituloRepository;
    private final DocenteMapper docenteMapper;
    private final AdministrativoMapper administrativoMapper;
    private final PasswordEncoder passwordEncoder;
    private final UniversidadService universidadService;

    @Override
    @Transactional
    public DocenteResponse registrar(RegistroDocenteRequest dto) {

        // 1. Validar contra BD universidad
        boolean docenteValido = universidadService.validarDocenteActivo(dto.getCedula());

        if (!docenteValido) {
            throw new UniversidadValidationException(
                "No se encontró un docente activo en BD de la universidad con cédula: " + dto.getCedula());
        }

        // 2. Verificar que no esté ya registrado
        if (personaRepository.existsByCedula(dto.getCedula()))
            throw new IllegalStateException(
                    "Ya existe una persona con cédula: " + dto.getCedula());

        if (userRepository.existsByEmail(dto.getEmail()))
            throw new IllegalStateException(
                    "Ya existe un usuario con email: " + dto.getEmail());

        // 3. Crear y guardar Persona — captura el retorno con el id generado
        Persona persona = new Persona();
        persona.setNombre(dto.getNombre());
        persona.setApellido(dto.getApellido());
        persona.setCedula(dto.getCedula());
        persona.setTelefono(dto.getTelefono());
        persona = personaRepository.save(persona);

        // 4. Crear Docente @MapsId lo deriva de persona
        Docente docente = new Docente();
        docente.setPersona(persona); // ← @MapsId toma el id de aquí
        docente.setCodigoDocente(dto.getCodigoDocente());
        docente.setTipoContrato(dto.getTipoContrato());

        if (dto.getProgramaIds() != null && !dto.getProgramaIds().isEmpty()) {
            Set<Programa> programas = new HashSet<>(
                    programaRepository.findAllById(dto.getProgramaIds()));
            docente.setProgramas(programas);
        }

        docente = docenteRepository.save(docente);

        // 5. Títulos
        if (dto.getTitulos() != null && !dto.getTitulos().isEmpty()) {
            Docente docenteFinal = docente;
            List<TituloAcademico> titulos = dto.getTitulos().stream()
                    .map(t -> {
                        TituloAcademico titulo = new TituloAcademico();
                        titulo.setTitulo(t.getTitulo());
                        titulo.setNivel(t.getNivel());
                        titulo.setInstitucion(t.getInstitucion());
                        titulo.setFechaObtencion(t.getFechaObtencion());
                        titulo.setPais(t.getPais());
                        titulo.setDocente(docenteFinal);
                        return titulo;
                    })
                    .toList();
            tituloRepository.saveAll(titulos);
        }

        // 6. Crear User con rol ROLE_DOCENTE
        Role rolDocente = roleRepository.findByName(RoleName.ROLE_DOCENTE)
                .orElseThrow(() -> new IllegalStateException(
                        "Rol ROLE_DOCENTE no encontrado"));

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEstado(EstadoUsuario.ACTIVO);
        user.setPersona(persona);
        user.setRoles(Set.of(rolDocente));
        userRepository.save(user);

        // 7. Al final de registrar() — pasa el user directamente para evitar query
        // extra
        Docente docenteGuardado = docenteRepository.findById(docente.getId()).orElseThrow();

        return docenteMapper.toDTO(docenteGuardado, user); // ← sobrecarga con user
    }

    @Transactional
    public DocenteAdministrativoResponse registrarDocenteAdministrativo(
            RegistroDocenteRequest docenteDto,
            RegistroAdminParaDocenteRequest adminDto) {

        // 1. Validar ambos perfiles contra BD universidad
        boolean docenteValido = universidadService.validarDocenteActivo(docenteDto.getCedula());
        boolean adminValido = universidadService.validarAdministrativoActivo(docenteDto.getCedula());

        if (!docenteValido || !adminValido) {
            throw new UniversidadValidationException(
                "No se encontró un docente o administrativo activo en BD de la universidad con cédula: " + docenteDto.getCedula());
        }

        if (personaRepository.existsByCedula(docenteDto.getCedula()))
            throw new IllegalStateException("Ya existe una persona con esa cédula");
        if (userRepository.existsByEmail(docenteDto.getEmail()))
            throw new IllegalStateException("Ya existe un usuario con ese email");

        // 2. Crear Persona (una sola, compartida)
        Persona persona = new Persona();
        persona.setNombre(docenteDto.getNombre());
        persona.setApellido(docenteDto.getApellido());
        persona.setCedula(docenteDto.getCedula());
        persona.setTelefono(docenteDto.getTelefono());
        persona = personaRepository.save(persona);

        // 3. Crear Docente
        Docente docente = new Docente();
        docente.setPersona(persona);
        docente.setCodigoDocente(docenteDto.getCodigoDocente());
        docente.setTipoContrato(docenteDto.getTipoContrato());
        docente = docenteRepository.save(docente);

        if (docenteDto.getProgramaIds() != null && !docenteDto.getProgramaIds().isEmpty()) {
            Set<Programa> programas = new HashSet<>(
                    programaRepository.findAllById(docenteDto.getProgramaIds()));
            docente.setProgramas(programas);
        }

        // 4. Títulos
        if (docenteDto.getTitulos() != null && !docenteDto.getTitulos().isEmpty()) {
            Docente docenteFinal = docente;
            List<TituloAcademico> titulos = docenteDto.getTitulos().stream()
                    .map(t -> {
                        TituloAcademico titulo = new TituloAcademico();
                        titulo.setTitulo(t.getTitulo());
                        titulo.setNivel(t.getNivel());
                        titulo.setInstitucion(t.getInstitucion());
                        titulo.setFechaObtencion(t.getFechaObtencion());
                        titulo.setPais(t.getPais());
                        titulo.setDocente(docenteFinal);
                        return titulo;
                    })
                    .toList();
            tituloRepository.saveAll(titulos);
        }

        // 5. Crear Administrativo (misma Persona)
        Administrativo admin = new Administrativo();
        admin.setPersona(persona);
        admin.setCargo(adminDto.getCargo());
        admin.setDependencia(adminDto.getDependencia());
        administrativoRepository.save(admin);

        // 6. Crear User con AMBOS roles
        Role rolDocente = roleRepository.findByName(RoleName.ROLE_DOCENTE).orElseThrow();
        Role rolAdmin = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow();

        User user = new User();
        user.setEmail(docenteDto.getEmail());
        user.setPassword(passwordEncoder.encode(docenteDto.getPassword()));
        user.setEstado(EstadoUsuario.ACTIVO);
        user.setPersona(persona);
        user.setRoles(Set.of(rolDocente, rolAdmin));
        userRepository.save(user);

        DocenteResponse docenteResponse = docenteMapper.toDTO(docente, user);
        AdministrativoResponse adminResponse = administrativoMapper.toDTO(admin, user);

        return new DocenteAdministrativoResponse(docenteResponse, adminResponse);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public DocenteResponse buscarPorId(Long id) {
        return docenteMapper.toDTO(buscarEntidad(id));
    }

    @Override
    @PreAuthorize("hasRole('DOCENTE')")
    public DocenteResponse buscarPorEmail(String email) {
        return docenteMapper.toDTO(docenteRepository.findByUserEmail(email)
                .orElseThrow(() -> new DocenteNotFoundException(
                        "Docente no encontrado para el usuario autenticado")));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<DocenteResponse> listarTodos() {
        return docenteMapper.toDTOList(docenteRepository.findAll());
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<DocenteResponse> listarPorPrograma(Long programaId) {
        return docenteMapper.toDTOList(
                docenteRepository.findByProgramaId(programaId));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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

        return docenteMapper.toDTO(docenteRepository.save(docente));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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

        return docenteMapper.toDTO(docenteRepository.findById(docenteId).orElseThrow());
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public void eliminarTitulo(Long tituloId) {
        if (!tituloRepository.existsById(tituloId))
            throw new IllegalArgumentException("Título académico no encontrado");
        tituloRepository.deleteById(tituloId);
    }

    private Docente buscarEntidad(Long id) {
        return docenteRepository.findById(id)
                .orElseThrow(() -> new DocenteNotFoundException(id));
    }
}
