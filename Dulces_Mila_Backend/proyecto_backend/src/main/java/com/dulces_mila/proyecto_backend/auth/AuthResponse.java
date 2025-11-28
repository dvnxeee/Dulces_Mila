package com.dulces_mila.proyecto_backend.auth;

public record AuthResponse(
    String token,        // Access Token
    String refreshToken,
    String email,
    String nombre,
    String rol
) {}