package com.dulces_mila.proyecto_backend.services;

import com.dulces_mila.proyecto_backend.entities.*;
import com.dulces_mila.proyecto_backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CarritoServiceImpl implements CarritoService {

    @Autowired private CarritoRepository carritoRepo;
    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private ProductoRepository productoRepo;
    @Autowired private ItemCarritoRepository itemRepo;

    // Obtiene (o crea) el carrito del usuario
    @Override
    public Carrito obtenerCarrito(String email) {
        return carritoRepo.findByUsuarioEmail(email).orElseGet(() -> {
            // Si no tiene carrito, creamos uno nuevo
            Usuario usuario = usuarioRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            Carrito nuevoCarrito = new Carrito();
            nuevoCarrito.setUsuario(usuario);
            return carritoRepo.save(nuevoCarrito);
        });
    }

    @Override
    @Transactional
    public Carrito agregarItem(String email, Long productoId, Integer cantidad) {
        Carrito carrito = obtenerCarrito(email);
        Producto producto = productoRepo.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar si el producto ya está en el carrito
        Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(productoId))
                .findFirst();

        if (itemExistente.isPresent()) {
            // Si existe, sumamos la cantidad
            ItemCarrito item = itemExistente.get();
            item.setCantidad(item.getCantidad() + cantidad);
        } else {
            // Si no, creamos uno nuevo
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(cantidad);
            carrito.getItems().add(nuevoItem);
        }
        
        return carritoRepo.save(carrito);
    }

    @Override
    @Transactional
    public Carrito eliminarItem(String email, Long productoId) {
        Carrito carrito = obtenerCarrito(email);
        // Removemos el item de la lista
        carrito.getItems().removeIf(item -> item.getProducto().getId().equals(productoId));
        return carritoRepo.save(carrito);
    }

    @Override
    @Transactional
    public void vaciarCarrito(String email) {
        Carrito carrito = obtenerCarrito(email);
        carrito.getItems().clear(); // Borra todo
        carritoRepo.save(carrito);
    }
}