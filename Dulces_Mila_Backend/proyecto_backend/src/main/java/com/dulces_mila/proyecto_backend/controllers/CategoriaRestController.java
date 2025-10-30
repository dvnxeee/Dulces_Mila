package com.dulces_mila.proyecto_backend.controllers;

import com.dulces_mila.proyecto_backend.entities.Categoria;
import com.dulces_mila.proyecto_backend.services.CategoriaService; // <-- El nuestro (singular)
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para el CRUD de Categorías.
 * Sigue el estilo que nos mandó la profesora.
 */
@CrossOrigin(origins = "http://localhost:5173") // Usamos el puerto del ejemplo
@RestController
@RequestMapping("/api/categorias")
public class CategoriaRestController {

    @Autowired
    private CategoriaService categoriaService; // <-- Inyectamos el nuestro

    // --- CREATE ---
    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@Valid @RequestBody Categoria categoria) {
        // @Valid activa las validaciones (ej. @NotBlank)
        Categoria nuevaCategoria = categoriaService.crear(categoria);
        return ResponseEntity.ok(nuevaCategoria);
    }

    // --- READ (All) ---
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        List<Categoria> categorias = categoriaService.listarTodas();
        return ResponseEntity.ok(categorias);
    }

    // --- READ (By ID) ---
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerCategoriaPorId(@PathVariable Long id) {
        // Manejamos el 404 Not Found si no existe
        return categoriaService.obtenerId(id)
                .map(categoria -> ResponseEntity.ok(categoria))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- UPDATE ---
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizarCategoria(@PathVariable Long id, @Valid @RequestBody Categoria categoriaActualizada) {
        try {
            // El servicio 'actualizar' ya maneja el error si no lo encuentra
            Categoria categoria = categoriaService.actualizar(id, categoriaActualizada);
            return ResponseEntity.ok(categoria);
        } catch (RuntimeException e) {
            // Si el servicio lanzó el error, devolvemos 404
            return ResponseEntity.notFound().build();
        }
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        try {
            // El servicio 'eliminar' ya maneja el error si no lo encuentra
            categoriaService.eliminar(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Manejador de Excepciones para @Valid ---
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}