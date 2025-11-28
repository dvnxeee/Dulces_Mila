package com.dulces_mila.proyecto_backend.repositories;

import com.dulces_mila.proyecto_backend.entities.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    // Buscar el carrito de un usuario específico (por email)
    Optional<Carrito> findByUsuarioEmail(String email);
}