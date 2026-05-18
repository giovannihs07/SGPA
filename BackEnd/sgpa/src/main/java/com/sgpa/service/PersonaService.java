package com.sgpa.service;

import java.util.List;
import java.util.Optional;

import com.sgpa.dto.request.PersonaRequest;
import com.sgpa.dto.response.PersonaResponse;

public interface PersonaService {

    List<PersonaResponse> findAll();

    Optional<PersonaResponse> findById(Long id);

    PersonaResponse save(PersonaRequest request);

    Optional<PersonaResponse> update(Long id, PersonaRequest request);

    void remove(Long id);
}
