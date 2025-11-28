package com.dulces_mila.proyecto_backend.services;

import com.dulces_mila.proyecto_backend.entities.Carrito;

public interface CarritoService {
    Carrito obtenerCarrito(String emailUsuario);
    Carrito agregarItem(String emailUsuario, Long productoId, Integer cantidad);
    Carrito eliminarItem(String emailUsuario, Long itemId);
    void vaciarCarrito(String emailUsuario);
}