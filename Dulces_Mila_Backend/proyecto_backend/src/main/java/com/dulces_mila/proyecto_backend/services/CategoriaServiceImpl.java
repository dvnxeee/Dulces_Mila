package com.dulces_mila.proyecto_backend.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dulces_mila.proyecto_backend.entities.Categoria;
import com.dulces_mila.proyecto_backend.repositories.CategoriaRepository; // <-- El nuestro

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository; // <-- El nuestro

    @Override
    public Categoria crear(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public Optional<Categoria> obtenerId(Long id) {
        // Devolvemos Optional para que el controlador decida
        return categoriaRepository.findById(id);
    }

    @Override
    public List<Categoria> listarTodas() {
        // Hacemos el cast a List
        return (List<Categoria>) categoriaRepository.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            // Lanzamos error si no existe
            throw new RuntimeException("Categoría no encontrada con id: " + id);
        }
        categoriaRepository.deleteById(id);
    }

    @Override
    public Categoria actualizar(Long id, Categoria categoriaActualizada) {
        // Usamos nuestro 'obtenerId' que devuelve Optional
        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        // Actualizamos los campos
        existente.setNombre(categoriaActualizada.getNombre());
        
        // Guardamos y devolvemos
        return categoriaRepository.save(existente);
    }
}