package com.sgpa.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.backend.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true) // Indicamos que esta operación es de solo lectura para optimizar el rendimiento
    // Método para cargar los detalles del usuario durante el proceso de autenticación
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { 

        Optional<com.sgpa.backend.model.users.User> userOptional = userRepository.findByEmail(email);

        if(!userOptional.isPresent()){ // Si el usuario no existe, lanzamos una excepción para que Spring Security lo maneje
            throw new UsernameNotFoundException(String.format("Email no existe en el sistema", email));
        }

        // Si el usuario existe, obtenemos la entidad User y sus roles para construir un UserDetails
        com.sgpa.backend.model.users.User user = userOptional.orElseThrow();

        // Convertimos los roles del usuario a GrantedAuthority para que Spring Security pueda manejarlos
        List<GrantedAuthority> authorities = user.getRoles().stream().
            map(r -> new SimpleGrantedAuthority(r.getName())).collect(Collectors.toList());

        // Construimos y retornamos un UserDetails con el username, password y roles del usuario
        return new User(
            user.getEmail(),
            user.getPassword(),
            true,
            true,
            true,
            true,
            authorities
        ); 
    }
    
}
