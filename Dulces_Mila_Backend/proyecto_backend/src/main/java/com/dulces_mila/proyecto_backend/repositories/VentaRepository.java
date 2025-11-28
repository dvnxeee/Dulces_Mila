package com.dulces_mila.proyecto_backend.repositories;

import com.dulces_mila.proyecto_backend.entities.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    // Para el historial de compras del cliente
    List<Venta> findByUsuarioEmail(String email);
}