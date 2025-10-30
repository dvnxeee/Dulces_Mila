package com.dulces_mila.proyecto_backend.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Esta es una clase de Configuración.
 * Aquí le decimos a Spring cómo queremos que se comporte
 * en ciertas cosas, en este caso, la Seguridad.
 */
@Configuration
public class SecurityConfig {

    /**
     * ¿Qué es un @Bean?
     * Es como registrar una "herramienta" global.
     * Estamos creando una herramienta para encriptar
     * y la registramos con @Bean para que Spring
     * sepa que existe y la pueda usar en otras partes
     * del proyecto (como en el UsuarioService).
     *
     * Esto cumple el requisito de "contraseña (encriptada)".
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Le decimos a Spring que la herramienta que
        // queremos usar es "BCrypt".
        // Es el estándar y el más seguro.
        return new BCryptPasswordEncoder();
    }

    /**
     * Este @Bean es para la configuración de seguridad de las rutas (URLs).
     * Por ahora, no queremos que Spring bloquee ninguna de nuestras
     * URLs de la API.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 1. Deshabilitamos 'csrf' (es una protección de seguridad
        //    que no necesitamos para una API REST simple).
        http.csrf(csrf -> csrf.disable())

        // 2. Le decimos que autorice TODAS las peticiones.
        //    (Más adelante, cuando hagamos el login, cambiaremos esto
        //    para proteger rutas).
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // Permite todo lo que empiece con /api/
                .anyRequest().permitAll() // Permite todo lo demás
            );

        // 3. Construimos la configuración.
        return http.build();
    }
}