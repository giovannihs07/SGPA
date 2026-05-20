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
import jakarta.servlet.http.HttpServletResponse;

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
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/users").permitAll()
                .requestMatchers(HttpMethod.GET, "/users/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/users/register").permitAll()
                .requestMatchers(HttpMethod.GET, "/users/roles").permitAll()
                .requestMatchers(HttpMethod.POST, "/users").permitAll()
                .requestMatchers(HttpMethod.PUT, "/users/{id}").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/users/{id}").permitAll()
                // GET en todos los endpoints - lectura permitida públicamente
                .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/registro").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/docentes/{id}/titulos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/administrativos/registro").permitAll()

                // Descargas de archivos permitidas públicamente
                .requestMatchers(HttpMethod.GET, "/api/productos/{id}/archivo").permitAll()
                

                // Rutas públicas de Swagger/OpenAPI
                .requestMatchers(
                    "/swagger-ui",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/swagger-ui/index.html",
                    "/v3/api-docs",
                    "/v3/api-docs/**",
                    "/v3/api-docs/swagger-config",
                    "/swagger-resources",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()
            )
            .addFilter(new JwtAuthenticationFilter(authManager))
            .addFilter(new JwtValidationFilter(authManager, userDetailsService))
            // .exceptionHandling(ex -> ex
            //     .authenticationEntryPoint((request, response, authException) -> {
            //         // Para rutas públicas, devolver 401 en lugar de 403
            //         if (request.getRequestURI().startsWith("/swagger-ui") || 
            //             request.getRequestURI().startsWith("/v3/api-docs") ||
            //             request.getRequestURI().equals("/swagger-ui.html")) {
            //             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            //             response.setContentType("application/json");
            //             response.getWriter().write("{\"error\":\"Authentication required\"}");
            //         } else {
            //             response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            //             response.setContentType("application/json");
            //             response.getWriter().write("{\"error\":\"Access denied\"}");
            //         }
            //     })
            // )
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