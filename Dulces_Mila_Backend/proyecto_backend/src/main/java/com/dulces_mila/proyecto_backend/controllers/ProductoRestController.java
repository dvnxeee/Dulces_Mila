package com.dulces_mila.proyecto_backend.controllers;

import com.dulces_mila.proyecto_backend.entities.Producto;
import com.dulces_mila.proyecto_backend.services.ProductoService; // <-- El nuestro (singular)
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

import org.springframework.web.multipart.MultipartFile; // <-- ¡Importante!

/**
 * Controlador REST para el CRUD de Productos.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/productos")
public class ProductoRestController {

    @Autowired
    private ProductoService productoService; // <-- Inyectamos el nuestro

    // --- CREATE ---
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {
        // Nuestro servicio 'crear' ya pone la fecha y el estado
        Producto nuevoProducto = productoService.crear(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    // --- READ (All) ---
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        List<Producto> productos = productoService.listarTodos();
        return ResponseEntity.ok(productos);
    }

    // --- READ (By ID) ---
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        return productoService.obtenerId(id)
                .map(producto -> ResponseEntity.ok(producto))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- UPDATE ---
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id,
            @Valid @RequestBody Producto productoActualizado) {
        try {
            // Nuestro servicio 'actualizar' ya maneja toda la lógica
            Producto producto = productoService.actualizar(id, productoActualizado);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- DELETE (Físico) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        try {
            productoService.eliminar(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- CAMBIOS DE ESTADO (Como en Usuario) ---
    @PatchMapping("/inhabilitar/{id}")
    public ResponseEntity<Producto> inhabilitarProducto(@PathVariable Long id) {
        try {
            Producto producto = productoService.inhabilitar(id);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/habilitar/{id}")
    public ResponseEntity<Producto> habilitarProducto(@PathVariable Long id) {
        try {
            Producto producto = productoService.habilitar(id);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- BÚSQUEDA (Rúbrica Frontend 2.7) ---
    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<Producto>> buscarPorNombre(@RequestParam String nombre) {
        List<Producto> productos = productoService.buscarPorNombre(nombre);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> buscarPorCategoria(@PathVariable Long categoriaId) {
        try {
            List<Producto> productos = productoService.buscarPorCategoria(categoriaId);
            return ResponseEntity.ok(productos);
        } catch (RuntimeException e) {
            // Si la categoría no existe, devuelve 404
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para subir una imagen de producto.
     * Se usa @RequestParam("file") para recibir el archivo.
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> subirImagen(@RequestParam("file") MultipartFile archivo) {

        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se subió ningún archivo"));
        }

        try {
            // 1. Llamamos al servicio para guardar la imagen
            String urlImagen = productoService.guardarImagen(archivo);

            // 2. Devolvemos una respuesta JSON con la URL
            // (Ej: {"url": "/uploads/abc-123-torta.jpg"})
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("url", urlImagen);

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint para obtener el conteo total de productos.
     * GET /api/productos/stats/count
     */
    @GetMapping("/stats/count")
    public ResponseEntity<Map<String, Long>> getStatsCount() {
        long total = productoService.contarTotalProductos();
        return ResponseEntity.ok(Map.of("count", total));
    }

    /**
     * Endpoint para obtener el conteo de productos con stock bajo (< 5).
     * GET /api/productos/stats/low-stock
     */
    @GetMapping("/stats/low-stock")
    public ResponseEntity<Map<String, Long>> getStatsLowStock() {
        long count = productoService.contarProductosBajoStock();
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Opcional: Si prefieres devolver la lista completa de productos
    @GetMapping("/stats/low-stock-list")
    public ResponseEntity<List<Producto>> getStatsLowStockList() {
        List<Producto> productos = productoService.obtenerProductosBajoStock();
        return ResponseEntity.ok(productos);
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