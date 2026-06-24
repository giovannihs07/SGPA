package com.sgpa.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sgpa.config.TokenJwtConfig;

import io.jsonwebtoken.Jwts;

@Service
public class JwtTokenService {

    private final long expirationMs;

    public JwtTokenService(@Value("${jwt.expiration}") long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public String generarToken(String email, List<String> roles) {
        return Jwts.builder()
            .claim("roles", roles)
            .subject(email)
            .signWith(TokenJwtConfig.getSecretKey())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationMs))
            .compact();
    }
}
