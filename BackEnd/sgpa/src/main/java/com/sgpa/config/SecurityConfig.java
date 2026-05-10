package com.sgpa.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import com.sgpa.security.auth.filters.JwtAuthenticationFilter;
import com.sgpa.security.auth.filters.JwtValidationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        AuthenticationManager authManager = authenticationConfiguration.getAuthenticationManager();

        // Configura las reglas de seguridad para las solicitudes HTTP.
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/users").permitAll()
                .requestMatchers(HttpMethod.GET, "/users/{id}").hasAnyRole("DOCENTE", "ADMIN", "SUPERADMIN")
                .requestMatchers(HttpMethod.POST, "/users").hasAnyRole("ADMIN", "SUPERADMIN")
                .requestMatchers("/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilter(new JwtAuthenticationFilter(authManager))
            .addFilter(new JwtValidationFilter(authManager, userDetailsService))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .build();
    }
}