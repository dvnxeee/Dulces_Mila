package com.dulces_mila.proyecto_backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.dulces_mila.proyecto_backend.entities.Producto;

/**
 * Interfaz para el servicio de Producto.
 * Define los métodos del CRUD y los de búsqueda.
 */
public interface ProductoService {

    Producto crear(Producto producto);
    Optional<Producto> obtenerId(Long id);
    List<Producto> listarTodos();
    void eliminar(Long id);
    Producto actualizar(Long id, Producto productoActualizado);

    // Métodos para 'Eliminar/Inhabilitar' (como en Usuario)
    Producto inhabilitar(Long id);
    Producto habilitar(Long id);

    // Métodos para Búsqueda
    List<Producto> buscarPorNombre(String nombre);
    List<Producto> buscarPorCategoria(Long categoriaId);

    /**
     * Este método se encarga de tomar un archivo, guardarlo
     * en el servidor y devolver la URL de acceso.
     */
    String guardarImagen(MultipartFile archivo); // Nuevo método para subir imágenes

    /** Obtiene el conteo total de productos. */
    long contarTotalProductos(); // ⬅️ NUEVO

    /** Obtiene el conteo de productos con stock bajo. */
    long contarProductosBajoStock(); // ⬅️ NUEVO
    
    // Opcional: Si prefieres devolver la lista
    List<Producto> obtenerProductosBajoStock();
}