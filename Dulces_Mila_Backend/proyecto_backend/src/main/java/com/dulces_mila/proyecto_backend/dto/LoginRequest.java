package com.dulces_mila.proyecto_backend.dto;

// Como usamos Lombok en las entidades, lo usamos aquí también.
import lombok.Data;

/**
 * Esta clase es un DTO (Data Transfer Object).
 * Es un objeto simple que solo usamos para "transferir"
 * los datos del login (email y contraseña) desde
 * el frontend (React) a nuestro controlador.
 */
@Data // <-- Crea Getters y Setters
public class LoginRequest {

    private String email;
    private String contraseña;

}