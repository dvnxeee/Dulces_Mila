package com.dulces_mila.proyecto_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    // Lee el secreto desde application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Lee la expiración desde application.properties
    @Value("${jwt.expiration}")
    private long expirationMs;

    // Tolerancia opcional (por defecto 0)
    @Value("${jwt.clockSkew:0}")
    private long clockSkewMs;
    
    // 1. NUEVO: Inyectamos la expiración del refresh token
    @Value("${jwt.refreshExpiration}")
    private long refreshExpirationMs;

    // ----- Métodos Auxiliares -----

    private Key getSigningKey() {
        try {
            // Intenta decodificar en Base64 (lo recomendado)
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException e) {
            // Si falla, usa los bytes directos (fallback)
            byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
            return Keys.hmacShaKeyFor(keyBytes);
        }
    }

    private Claims parseAllClaims(String token) {
        var parser = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(clockSkewMs / 1000)
                .build();
        return parser.parseClaimsJws(token).getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(parseAllClaims(token));
    }

    // ----- Generar Token -----

    // MODIFICADO: generateToken ahora usa expirationMs (Token de Acceso)
    public String generateToken(String username) {
        return buildToken(username, expirationMs);
    }

    // NUEVO: generateRefreshToken usa refreshExpirationMs (Token de Refresco)
    public String generateRefreshToken(String username) {
        return buildToken(username, refreshExpirationMs);
    }

    // Método auxiliar para no repetir código
    private String buildToken(String username, long expiration) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(String username, Map<String, Object> extraClaims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ----- Extraer Información -----

    public String getUsernameFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ----- Validar Token -----

    public boolean validateToken(String token) {
        try {
            parseAllClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token expirado: " + e.getMessage());
            return false;
        } catch (SignatureException e) {
            System.out.println("Firma inválida: " + e.getMessage());
            return false;
        } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            System.out.println("Token inválido: " + e.getMessage());
            return false;
        }
    }
}