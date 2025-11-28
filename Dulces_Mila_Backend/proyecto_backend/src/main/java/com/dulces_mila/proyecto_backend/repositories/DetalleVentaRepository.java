package com.dulces_mila.proyecto_backend.repositories;

import com.dulces_mila.proyecto_backend.entities.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}