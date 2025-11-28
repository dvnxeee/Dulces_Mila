package com.dulces_mila.proyecto_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "detalle_ventas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Muchos detalles pertenecen a una venta
    @ManyToOne
    @JoinColumn(name = "venta_id", nullable = false)
    @JsonIgnore // Evita bucle infinito al convertir a JSON
    private Venta venta;

    // Relación: Un detalle apunta a un producto
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Long precioUnitario; // Guardamos el precio al momento de la compra

    @Column(nullable = false)
    private Long subtotal; // cantidad * precioUnitario
}