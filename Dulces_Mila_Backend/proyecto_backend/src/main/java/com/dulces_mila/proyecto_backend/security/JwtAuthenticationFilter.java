package com.dulces_mila.proyecto_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.lang.NonNull;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsService uds) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = uds;
    }

    // Evitamos filtrar las rutas de autenticación para no crear bucles o errores innecesarios
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/auth");
    }

    @Override
    protected void doFilterInternal(
           @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain
    ) throws ServletException, IOException {

        // Obtener el header de autorización
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Validar que el header exista y tenga el formato "Bearer <token>"
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // Extraer el token (quitando "Bearer ")
        String token = header.substring(7);

        // Validar el token con nuestra clase de utilidad
        if (!jwtUtils.validateToken(token)) {
            chain.doFilter(request, response);
            return;
        }

        // Obtener el usuario del token
        String username = jwtUtils.getUsernameFromToken(token);

        // Cargar los detalles del usuario desde la base de datos
        UserDetails user = userDetailsService.loadUserByUsername(username);

        // Crear el objeto de autenticación
        var auth = new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()
        );

        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // Establecer la autenticación en el contexto de seguridad
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Continuar con la cadena de filtros
        chain.doFilter(request, response);
    }
}