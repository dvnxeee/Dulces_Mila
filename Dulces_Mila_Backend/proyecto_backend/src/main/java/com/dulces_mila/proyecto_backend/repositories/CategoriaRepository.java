package com.dulces_mila.proyecto_backend.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.dulces_mila.proyecto_backend.entities.Categoria;

/**
 * Repositorio (DAO) para la entidad Categoria.
 * Al extender CrudRepository, Spring nos da los métodos
 * CRUD básicos (save, findById, findAll, delete) gratis.
 */
@Repository
public interface CategoriaRepository extends CrudRepository<Categoria, Long> {
    // No necesitamos métodos extra por ahora
}