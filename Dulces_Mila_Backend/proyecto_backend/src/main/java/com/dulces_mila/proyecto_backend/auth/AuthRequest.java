package com.dulces_mila.proyecto_backend.auth;

// Usamos 'record' que es una forma moderna y corta de hacer DTOs en Java
public record AuthRequest(String email, String password) {}