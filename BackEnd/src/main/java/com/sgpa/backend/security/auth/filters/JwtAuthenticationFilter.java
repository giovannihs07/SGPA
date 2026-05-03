package com.sgpa.backend.security.auth.filters;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Collection;
import java.util.Date;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sgpa.backend.config.TokenJwtConfig;

import io.jsonwebtoken.Jwts;

import static com.sgpa.backend.config.TokenJwtConfig.*;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

// Esta clase es un filtro de autenticación personalizado extiende UsernamePasswordAuthenticationFilter 
// para manejar la autenticación de usuarios utilizando JWT (JSON Web Tokens)
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private AuthenticationManager authenticationManager;
    
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    // Este método se llama cuando un usuario intenta autenticarse, 
    // extrae las credenciales del usuario (email y password) del cuerpo de la solicitud HTTP, 
    // crea un token de autenticación y delega el proceso de autenticación al AuthenticationManager
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        
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
        
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    // Este método se llama cuando la autenticación es exitosa, y es responsable de 
    // generar un token JWT para el usuario autenticado,
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authResult) throws IOException, ServletException {

        // Aquí se genera el token JWT utilizando la información del usuario autenticado y se agregan los encabezados de autorización a la respuesta HTTP
        String email = ((org.springframework.security.core.userdetails.User) authResult.getPrincipal()).getUsername();

        // Obtenemos los roles del usuario autenticado para incluirlos en el token JWT como reclamos (claims)
        Collection<? extends GrantedAuthority> roles = authResult.getAuthorities();
        // Verificamos si el usuario tiene el rol de "ROLE_ADMIN" para incluir esta información como un claim adicional
        boolean isAdmin = roles.stream().anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));
        
        // Generación del token JWT utilizando la información del usuario autenticado
        String token = Jwts.builder()
                .claim("isAdmin", isAdmin) // Agregamos los claims al token JWT, incluyendo los roles del usuario
                .subject(email) // Asignación del nombre de usuario como sujeto del token JWT
                .signWith(TokenJwtConfig.getSecretKey()) // Firma del token JWT utilizando la clave secreta definida en TokenJwtConfig
                .issuedAt(new Date()) // Fecha de emisión del token JWT
                .expiration(new Date(System.currentTimeMillis() + 3600000)) // El token expirará en 1 hora
                .compact(); // Compresión del token JWT en una cadena de texto

        // Agregamos el token JWT generado a los encabezados de autorización de la respuesta HTTP
        response.addHeader(HEADER_AUTHORIZATION, PREFIX_TOKEN + token);

        
        Map<String, Object> body = new HashMap<>();
        body.put("token", token);
        body.put("message", String.format("¡Hola %s, has iniciado sesión con éxito!", email));
        body.put("email", email);
        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
        response.setStatus(200);
        response.setContentType("application/json");
    }

    @Override
    // Este método se llama cuando la autenticación falla, y es responsable de 
    // manejar los errores de autenticación y enviar una respuesta HTTP adecuada al cliente
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException, ServletException {

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Error en la autenticación, email o password incorrecto!");
        body.put("Error", failed.getMessage());
        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
        response.setStatus(401);
        response.setContentType("application/json");
    }
    
}
