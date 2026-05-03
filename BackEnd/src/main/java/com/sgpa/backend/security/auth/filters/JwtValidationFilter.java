package com.sgpa.backend.security.auth.filters;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.sgpa.backend.config.TokenJwtConfig;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import static com.sgpa.backend.config.TokenJwtConfig.*;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;


public class JwtValidationFilter extends BasicAuthenticationFilter {

    private final UserDetailsService userDetailsService;

    public JwtValidationFilter(AuthenticationManager authenticationManager, 
        UserDetailsService userDetailsService) {
        super(authenticationManager);
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        String header = request.getHeader(HEADER_AUTHORIZATION);

        if (header == null || !header.startsWith(PREFIX_TOKEN)) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7); // Aquí se extrae el token JWT del encabezado de autorización 
        // se corte el prefijo "Bearer " (de 7 caracteres) para obtener solo el token JWT que se va a validar
        
        // Validación del token JWT utilizando la clave secreta definida en TokenJwtConfig
        try {
        
            Claims claims = Jwts.parser()
                .verifyWith(TokenJwtConfig.getSecretKey()) // Se establece la clave secreta para verificar la firma del token JWT utilizando la clave secreta definida en TokenJwtConfig
                .build()
                .parseSignedClaims(token) // Se valida el token JWT utilizando la clave secreta definida en TokenJwtConfig
                .getPayload(); // Se extrae el cuerpo del token JWT
            
            String username = claims.getSubject(); // Se extrae el nombre de usuario del token JWT
            
            // Si el nombre de usuario es válido y no hay una autenticación ya establecida en el contexto de seguridad,
            // se carga el usuario desde la base de datos utilizando el UserDetailsService y se establece la autenticación 
            // en el contexto de seguridad para que el usuario pueda acceder a los recursos protegidos de la aplicación
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Roles desde la BD
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            chain.doFilter(request, response); // Se continúa con la cadena de filtros de Spring Security para procesar la solicitud HTTP

        } catch (Exception e) {
            Map<String, String> body = new HashMap<>();
            body.put("error", e.getMessage());
            body.put("message", "Token inválido o expirado!");

            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
        }
    }

}
