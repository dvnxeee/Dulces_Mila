package com.dulces_mila.proyecto_backend.services;

import com.dulces_mila.proyecto_backend.entities.Categoria;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz para el servicio de Categoria.
 * Define los métodos del CRUD.
 */
public interface CategoriaService {

    Categoria crear(Categoria categoria);
    Optional<Categoria> obtenerId(Long id); // Usaremos Optional para mejor manejo
    List<Categoria> listarTodas();
    void eliminar(Long id);
    Categoria actualizar(Long id, Categoria categoriaActualizada);
}