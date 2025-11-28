package com.dulces_mila.proyecto_backend.controllers;

import com.dulces_mila.proyecto_backend.entities.Carrito;
import com.dulces_mila.proyecto_backend.services.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
public class CarritoRestController {

    @Autowired private CarritoService carritoService;

    // Helper para obtener email del token
    private String getEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    @GetMapping
    public ResponseEntity<Carrito> miCarrito() {
        return ResponseEntity.ok(carritoService.obtenerCarrito(getEmail()));
    }

    @PostMapping("/agregar")
    public ResponseEntity<Carrito> agregarItem(@RequestBody Map<String, Object> payload) {
        Long productoId = Long.valueOf(payload.get("productoId").toString());
        Integer cantidad = Integer.valueOf(payload.get("cantidad").toString());
        return ResponseEntity.ok(carritoService.agregarItem(getEmail(), productoId, cantidad));
    }

    @DeleteMapping("/eliminar/{productoId}")
    public ResponseEntity<Carrito> eliminarItem(@PathVariable Long productoId) {
        return ResponseEntity.ok(carritoService.eliminarItem(getEmail(), productoId));
    }
    
    @DeleteMapping("/vaciar")
    public ResponseEntity<Void> vaciarCarrito() {
        carritoService.vaciarCarrito(getEmail());
        return ResponseEntity.ok().build();
    }
}