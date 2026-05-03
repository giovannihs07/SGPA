package com.sgpa.backend.config;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

// Esta clase es una configuración para manejar los tokens JWT (JSON Web Tokens) en la aplicación.
// Define constantes para el prefijo del token y el encabezado de autorización, 
// y también maneja la clave secreta utilizada para firmar y verificar los tokens JWT. 
@Component
public class TokenJwtConfig {

    public static final String PREFIX_TOKEN = "Bearer ";
    public static final String HEADER_AUTHORIZATION = "Authorization";

    private static SecretKey SECRET_KEY_INSTANCE;

    @Value("${jwt.secret}")
    public void setSecret(String secret) {
        SECRET_KEY_INSTANCE = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public static SecretKey getSecretKey() {
        return SECRET_KEY_INSTANCE;
    }
}