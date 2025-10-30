package com.dulces_mila.proyecto_backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Esta es la entidad para la tabla 'usuarios'.
 * También incluye las "Validaciones en el modelo"
 */
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Campo requerido

    @NotBlank(message = "El nombre no puede estar vacío")
    @Column(nullable = false, length = 50)
    private String nombre; // Campo requerido

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El formato del email no es válido")
    @Column(nullable = false, unique = true, length = 100)
    private String email; // Campo requerido

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(nullable = false, length = 60)
    private String contraseña; // Campo requerido (encriptada)

    @NotNull(message = "El rol no puede ser nulo") // Validación
    @Enumerated(EnumType.STRING) // Guardo "CLIENTE" (texto) en la BD, no "0" (número)
    @Column(nullable = false, length = 20)
    private Rol rol; // Campo requerido (usa el Enum Rol)

    @NotNull(message = "El estado no puede ser nulo") // Validación
    @Enumerated(EnumType.STRING) // Guardo "ACTIVO" (texto) en la BD
    @Column(nullable = false, length = 10)
    private Estado estado; // Campo requerido (usa el Enum Estado)

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion; // Requerido (sistema)

    // Constructor vacío necesario para JPA
    public Usuario() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}