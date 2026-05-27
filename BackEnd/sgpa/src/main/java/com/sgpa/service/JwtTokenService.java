package com.sgpa.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sgpa.config.TokenJwtConfig;

import io.jsonwebtoken.Jwts;

@Service
public class JwtTokenService {

    private static final long EXPIRATION_MS = 3_600_000L;

    public String generarToken(String email, List<String> roles) {
        return Jwts.builder()
            .claim("roles", roles)
            .subject(email)
            .signWith(TokenJwtConfig.getSecretKey())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
            .compact();
    }
}
