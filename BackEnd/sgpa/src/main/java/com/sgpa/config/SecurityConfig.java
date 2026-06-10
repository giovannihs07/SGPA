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
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.web.cors.CorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgpa.security.auth.filters.JwtAuthenticationFilter;
import com.sgpa.security.auth.filters.JwtValidationFilter;
import com.sgpa.service.AuthService;
import com.sgpa.service.AuditService;

@Configuration
public class SecurityConfig {

    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Autowired
    private AuthService authService;

    @Autowired
    private AuditService auditService;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, ObjectMapper objectMapper) throws Exception {

        AuthenticationManager authManager = authenticationManager();

        // Configura las reglas de seguridad para las solicitudes HTTP.
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/usuarios/{id}/activar").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/usuarios/{id}/desactivar").permitAll()
                .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()
                .requestMatchers(HttpMethod.PUT, "/usuarios/{id}").permitAll()
                // GET en todos los endpoints - lectura permitida públicamente
                .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/**").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/registro").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/{id}/titulos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/administrativos/registro").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/perfil").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/perfil").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/perfil/docente").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/perfil/docente/programas").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/perfil/administrativo").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/usuarios/perfil/titulos").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/perfil/titulos/*").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/cambiar-password").authenticated()

                // Rutas públicas para listar facultades y programas (necesarias para el registro de docentes)
                .requestMatchers(HttpMethod.GET, "/api/facultades").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/facultades/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/programas").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/programas/{id}").permitAll()
                // Descargas de archivos permitidas públicamente
                .requestMatchers(HttpMethod.GET, "/api/productos/{id}/archivo").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/{id}/archivos/{archivoId}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/productos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/schema").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/productos").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/productos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/categorias").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/subcategorias").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/subcategorias").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/tipos-productos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tipos-productos").permitAll()
                .anyRequest().permitAll()
            )
            .addFilter(new JwtAuthenticationFilter(authManager, authService, objectMapper, auditService))
            .addFilter(new JwtValidationFilter(authManager, userDetailsService))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers(
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**"
        );
    }
}