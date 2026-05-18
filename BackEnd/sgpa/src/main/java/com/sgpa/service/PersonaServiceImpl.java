package com.sgpa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.request.PersonaRequest;
import com.sgpa.dto.response.PersonaResponse;
import com.sgpa.exception.PersonaNotFoundException;
import com.sgpa.mapper.PersonaMapper;
import com.sgpa.model.Persona;
import com.sgpa.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PersonaServiceImpl implements PersonaService {

    private final PersonaRepository repository;
    private final PersonaMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<PersonaResponse> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PersonaResponse> findById(Long id) {
        return repository.findById(id).map(mapper::toResponse);
    }

    @Override
    @Transactional
    public PersonaResponse save(PersonaRequest request) {
        Persona persona = mapper.toEntity(request);
        return mapper.toResponse(repository.save(persona));
    }

    @Override
    @Transactional
    public Optional<PersonaResponse> update(Long id, PersonaRequest request) {
        return repository.findById(id).map(persona -> {
            mapper.updateEntity(persona, request);
            return mapper.toResponse(repository.save(persona));
        });
    }

    @Override
    @Transactional
    public void remove(Long id) {
        if (!repository.existsById(id)) {
            throw new PersonaNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
