package com.dulces_mila.proyecto_backend.controllers;

import com.dulces_mila.proyecto_backend.dto.CompraRequest;
import com.dulces_mila.proyecto_backend.entities.Venta;
import com.dulces_mila.proyecto_backend.services.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaRestController {

    @Autowired
    private VentaService ventaService;

    // Endpoint para realizar una compra (POST /api/ventas)
    @PostMapping
    public ResponseEntity<Venta> realizarVenta(@RequestBody CompraRequest compraRequest) {
        
        // Obtenemos el email del usuario autenticado desde el Token JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName(); // Esto nos da el email gracias a JwtAuthenticationFilter

        Venta nuevaVenta = ventaService.realizarVenta(emailUsuario, compraRequest);
        return ResponseEntity.ok(nuevaVenta);
    }

    // Endpoint para ver el historial (GET /api/ventas/mis-compras)
    @GetMapping("/mis-compras")
    public ResponseEntity<List<Venta>> obtenerMisCompras() {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        List<Venta> historial = ventaService.obtenerVentasPorUsuario(emailUsuario);
        return ResponseEntity.ok(historial);
    }
}