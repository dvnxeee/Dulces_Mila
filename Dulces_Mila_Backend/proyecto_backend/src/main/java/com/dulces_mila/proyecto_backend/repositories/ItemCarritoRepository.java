package com.dulces_mila.proyecto_backend.repositories;

import com.dulces_mila.proyecto_backend.entities.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
}