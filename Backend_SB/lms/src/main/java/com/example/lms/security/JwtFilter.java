package com.example.lms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                
                String role = jwtUtil.extractRole(token);
                Integer member_id = jwtUtil.extractMemberId(token);
                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

                var auth = new UsernamePasswordAuthenticationToken(
                        member_id,
                        null,
                        authorities
                );

                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                
            }
        }

        filterChain.doFilter(request, response);
    }
}