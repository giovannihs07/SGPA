package com.sgpa.security.auth.filters;

import static com.sgpa.config.TokenJwtConfig.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgpa.config.TokenJwtConfig;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtValidationFilter extends BasicAuthenticationFilter {

    private final UserDetailsService userDetailsService;

    public JwtValidationFilter(AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService) {
        super(authenticationManager);
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String requestURI = request.getRequestURI();

        // Rutas públicas — no necesitan validación JWT
        if (requestURI.startsWith("/swagger-ui") ||
            requestURI.startsWith("/v3/api-docs") ||
            requestURI.startsWith("/swagger-resources") ||
            requestURI.startsWith("/webjars") ||
            requestURI.equals("/swagger-ui.html") ||
            requestURI.equals("/api/auth/login")) {
            chain.doFilter(request, response);
            return;
        }

        // Descarga pública — no bloquear por JWT expirado o inválido
        if (requestURI.matches("/api/productos/\\d+/archivo")) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HEADER_AUTHORIZATION);

        // Si no hay token simplemente continúa
        // Spring Security bloqueará los endpoints protegidos
        if (header == null || !header.startsWith(PREFIX_TOKEN)) {
            chain.doFilter(request, response);
            return;
        }

        // Elimina el prefijo "Bearer " para obtener solo el token
        String token = header.substring(7);

        try {
            Claims claims = Jwts.parser()
                .verifyWith(TokenJwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

            String email = claims.getSubject();

            if (email != null && SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

                // Carga el usuario desde la BD con sus roles actuales
                // Esto garantiza que si los roles cambian en BD
                // el nuevo token los reflejará
                UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

                // Verifica que el usuario sigue activo
                if (!userDetails.isEnabled()) {
                    Map<String, String> body = new HashMap<>();
                    body.put("error", "Usuario inactivo");
                    body.put("message", "Tu cuenta está desactivada");
                    response.getWriter()
                        .write(new ObjectMapper().writeValueAsString(body));
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    return;
                }

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
            }

            chain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            writeAuthError(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "SESSION_EXPIRED",
                    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        } catch (JwtException e) {
            writeAuthError(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "INVALID_TOKEN",
                    "Tu sesión no es válida. Por favor, inicia sesión nuevamente.");
        } catch (Exception e) {
            writeAuthError(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "INVALID_TOKEN",
                    "Tu sesión no es válida. Por favor, inicia sesión nuevamente.");
        }
    }

    private void writeAuthError(HttpServletResponse response, int status,
            String code, String message) throws IOException {
        Map<String, String> body = new HashMap<>();
        body.put("error", code);
        body.put("message", message);
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
    }
}