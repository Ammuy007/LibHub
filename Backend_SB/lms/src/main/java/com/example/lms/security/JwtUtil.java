package com.example.lms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    
    private final String SECRET="libhub123123123123123123123123123123123123";
    private final long EXPIRATION = 86400000; 

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String email, String role, Integer memberId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("memberId", memberId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    
    public Integer extractMemberId(String token) {
        return extractAllClaims(token).get("memberId", Integer.class);
    }

    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}