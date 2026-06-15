package com.sgpa.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.web.cors.CorsConfigurationSource;

import com.sgpa.security.auth.filters.JwtValidationFilter;

// Configuración de seguridad para la aplicación
@Configuration
// Habilitar la seguridad de métodos en la aplicación @PreAuthorize, @PostAuthorize, etc.
@EnableMethodSecurity
public class SecurityConfig {

    // Configuración de autenticación
    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;

    // Servicio de detalles de usuario
    @Autowired
    private UserDetailsService userDetailsService;

    // Configuración de CORS
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    // Codificador de contraseñas
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Gestor de autenticación
    @Bean
    AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Cadena de filtros de seguridad
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        AuthenticationManager authManager = authenticationManager();

        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // PERMISOS GENERALES
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/registro").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/registro-docente-admin").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/administrativos/registro").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/facultades").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/facultades/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/programas").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/programas/niveles").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/programas/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/schema").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/publicos/resumen").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/publicos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/publicos/*").permitAll()
                .requestMatchers("/api/productos/mis/**").hasRole("DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/productos/opciones").hasRole("DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/productos/*/archivo").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/*/archivos/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/*").hasAnyRole("DOCENTE", "ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/usuarios/perfil/**").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/cambiar-password").authenticated()

                // SUPERADMIN
                .requestMatchers("/api/auditoria/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/taxonomia/**").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/roles/disponibles").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/roles/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/categorias/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/subcategorias/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/tipos-producto/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/instituciones/**").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/facultades").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/facultades/*").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/facultades/*").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/programas").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/programas/*").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/programas/*").hasRole("SUPER_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/roles").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/usuarios").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/usuarios/*").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/activar").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/desactivar").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/email").hasAnyRole("ADMIN", "SUPER_ADMIN")

                // DOCENTES Y ADMINISTRATIVOS
                .requestMatchers(HttpMethod.GET, "/api/docentes/mi").hasRole("DOCENTE")
                .requestMatchers(HttpMethod.GET, "/api/docentes").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/docentes/*").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/docentes/*").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/docentes/*/titulos").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/docentes/titulos/*").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/administrativos/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/productos").hasRole("DOCENTE")

                // Docentes, Administrativos y Superadmin
                .requestMatchers(HttpMethod.GET, "/api/productos").hasAnyRole("DOCENTE", "ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/*").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/productos/*/publicar").hasAnyRole("DOCENTE", "ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/productos/*/despublicar").hasAnyRole("DOCENTE", "ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/*").hasAnyRole("DOCENTE", "ADMIN", "SUPER_ADMIN")
                .anyRequest().denyAll()
            )
            .addFilter(new JwtValidationFilter(authManager, userDetailsService))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .build();
    }

    // Configuración de seguridad web
    // Ignorar las rutas de swagger y api-docs
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers(
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**"
        );
    }
}
