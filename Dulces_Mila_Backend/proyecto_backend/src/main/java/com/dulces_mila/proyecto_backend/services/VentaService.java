package com.dulces_mila.proyecto_backend.services;

import com.dulces_mila.proyecto_backend.dto.CompraRequest;
import com.dulces_mila.proyecto_backend.entities.Venta;
import java.util.List;

public interface VentaService {
    // Método principal: Realizar una compra
    Venta realizarVenta(String emailUsuario, CompraRequest compraRequest);
    
    // Ver historial
    List<Venta> obtenerVentasPorUsuario(String email);
}