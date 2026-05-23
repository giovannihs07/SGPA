package com.sgpa.security.auth.filters;

import static com.sgpa.config.TokenJwtConfig.*;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sgpa.config.TokenJwtConfig;
import com.sgpa.model.users.User;
import com.sgpa.repository.UserRepository;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        // Define la URL del endpoint de login
        setFilterProcessesUrl("/api/auth/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
            HttpServletResponse response) throws AuthenticationException {

        String email = null;
        String password = null;

        try {
            Map<?, ?> credentials = new ObjectMapper()
                .readValue(request.getInputStream(), Map.class);
            email = (String) credentials.get("email");
            password = (String) credentials.get("password");
        } catch (JacksonException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(email, password);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain,
            Authentication authResult) throws IOException, ServletException {

        String email = ((org.springframework.security.core.userdetails.User)
            authResult.getPrincipal()).getUsername();

        Collection<? extends GrantedAuthority> roles = authResult.getAuthorities();

        // Extrae todos los roles como lista de strings
        // Resultado: ["ROLE_DOCENTE", "ROLE_ADMIN", etc.]
        List<String> nombreRoles = roles.stream()
            .map(GrantedAuthority::getAuthority)
            .filter(role -> role.startsWith("ROLE_"))
            .toList();

        String token = Jwts.builder()
            .claim("roles", nombreRoles)
            .subject(email)
            .signWith(TokenJwtConfig.getSecretKey())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 3600000))
            .compact();

        response.addHeader(HEADER_AUTHORIZATION, PREFIX_TOKEN + token);

        User user = userRepository.findByEmail(email).orElseThrow();

        Map<String, Object> body = new HashMap<>();
        body.put("token", token);
        body.put("userId", user.getId());
        body.put("message", String.format("¡Hola %s, has iniciado sesión con éxito!", email));
        body.put("email", email);
        body.put("roles", nombreRoles);

        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
        response.setStatus(200);
        response.setContentType("application/json");
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException failed) throws IOException, ServletException {

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Error en la autenticación, email o password incorrecto!");
        body.put("error", failed.getMessage());

        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
        response.setStatus(401);
        response.setContentType("application/json");
    }
}