package com.dulces_mila.proyecto_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ventas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Una venta pertenece a un usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fecha;

    // Desglose de montos (Requisito: Cálculos e IVA)
    @Column(nullable = false)
    private Long montoNeto; // Total sin IVA
    
    @Column(nullable = false)
    private Long montoIva;  // El 19%
    
    @Column(nullable = false)
    private Long total;     // Total a pagar

    // Relación: Una venta tiene muchos detalles
    // 'cascade = CascadeType.ALL' significa que si guardas la Venta, 
    // se guardan automáticamente sus detalles.
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    private List<DetalleVenta> detalles;

    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }
}