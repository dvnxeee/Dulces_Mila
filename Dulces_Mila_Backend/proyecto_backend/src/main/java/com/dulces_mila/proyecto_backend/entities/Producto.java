package com.dulces_mila.proyecto_backend.entities;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // <-- Getters, Setters, etc.
@NoArgsConstructor // <-- Constructor vacío
@AllArgsConstructor // <-- Constructor con todo
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Column(nullable = false, length = 100)
    private String nombre; // Requerido 

    @Column(length = 500)
    private String descripcion; // Requerido 

    @NotNull(message = "El precio no puede ser nulo")
    @PositiveOrZero(message = "El precio debe ser 0 o mayor")
    @Column(nullable = false)
    private Long precio; // Requerido

    @NotNull(message = "El stock no puede ser nulo")
    @PositiveOrZero(message = "El stock debe ser 0 o mayor")
    @Column(nullable = false)
    private Integer stock; // Requerido por Rúbrica 

    @Column(length = 255) // Guarda la URL
    private String imagen;

    @NotNull(message = "El estado no puede ser nulo")
    @Enumerated(EnumType.STRING) // Usamos el Enum (como en Usuario)
    @Column(nullable = false)
    private Estado estado;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // --- Relación ---
    @NotNull(message = "La categoría no puede ser nula")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria; // Requerido 
}