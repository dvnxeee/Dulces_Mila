package com.dulces_mila.proyecto_backend.services;

import java.nio.file.Files;
import java.time.LocalDateTime; // <-- ¡Importante para la fecha!
import java.util.List;
import java.util.Optional;
import java.util.UUID; // Para nombres únicos

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dulces_mila.proyecto_backend.entities.Categoria;
import com.dulces_mila.proyecto_backend.entities.Estado; // <-- ¡Importante para el estado!
import com.dulces_mila.proyecto_backend.entities.Producto;
import com.dulces_mila.proyecto_backend.repositories.CategoriaRepository; // <-- Necesitamos este
import com.dulces_mila.proyecto_backend.repositories.ProductoRepository; // <-- El nuestro

import org.springframework.beans.factory.annotation.Value; // <- ¡Importante!
import org.springframework.web.multipart.MultipartFile; // <- ¡Importante!

// Importaciones para manejar archivos
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository; // <-- El nuestro

    // Necesitamos el repo de Categoría para el método 'buscarPorCategoria'
    @Autowired
    private CategoriaRepository categoriaRepository;

    // Inyectamos el valor que pusimos en application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public Producto crear(Producto producto) {
        // 1. Poner la fecha de creación del sistema
        producto.setFechaCreacion(LocalDateTime.now());
        // 2. Poner el estado por defecto (si no viene)
        if (producto.getEstado() == null) {
            producto.setEstado(Estado.ACTIVO);
        }
        // --- FIN LÓGICA ---

        return productoRepository.save(producto);
    }

    @Override
    public Optional<Producto> obtenerId(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public List<Producto> listarTodos() {
        return (List<Producto>) productoRepository.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    @Override
    public Producto actualizar(Long id, Producto productoActualizado) {
        // 1. Buscamos el producto existente
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        // 2. Actualizamos TODOS los campos que permite la rúbrica
        existente.setNombre(productoActualizado.getNombre());
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setPrecio(productoActualizado.getPrecio());
        existente.setStock(productoActualizado.getStock()); // <-- Control de stock
        existente.setImagen(productoActualizado.getImagen()); // <-- URL de imagen
        existente.setEstado(productoActualizado.getEstado());
        existente.setCategoria(productoActualizado.getCategoria());

        // 3. Guardamos
        return productoRepository.save(existente);
    }

    @Override
    public Producto inhabilitar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        producto.setEstado(Estado.INACTIVO); // Usamos nuestro Enum
        return productoRepository.save(producto);
    }

    @Override
    public Producto habilitar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        producto.setEstado(Estado.ACTIVO); // Usamos nuestro Enum
        return productoRepository.save(producto);
    }

    @Override
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    public List<Producto> buscarPorCategoria(Long categoriaId) {
        // Buscamos la categoría primero
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + categoriaId));

        return productoRepository.findByCategoria(categoria);
    }

    /**
     * Lógica para guardar la imagen
     */
    @Override
    public String guardarImagen(MultipartFile archivo) {
        try {
            // 1. Generar un nombre de archivo único
            String nombreOriginal = archivo.getOriginalFilename();
            // Sacamos la extensión (ej. ".jpg")
            String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            // Creamos un nombre único (ej. "abc-123-def.jpg")
            String nombreUnico = UUID.randomUUID().toString() + extension;

            // 2. Definir la ruta de guardado
            // Paths.get(uploadDir) -> "uploads/"
            Path rutaDeGuardado = Paths.get(uploadDir).resolve(nombreUnico).toAbsolutePath();

            // 3. Crear la carpeta 'uploads' si no existe
            Files.createDirectories(Paths.get(uploadDir).toAbsolutePath());

            // 4. Copiar el archivo al servidor
            Files.copy(archivo.getInputStream(), rutaDeGuardado);

            // 5. Devolver la URL relativa que usará el frontend
            // (Ej: "/uploads/abc-123-torta.jpg")
            return "/uploads/" + nombreUnico;

        } catch (Exception e) {
            // Si algo sale mal, lanzamos un error
            throw new RuntimeException("Error al guardar la imagen: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public long contarTotalProductos() {
        // Llama al nuevo método del repositorio
        return productoRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public long contarProductosBajoStock() {
        // Llama al método del repositorio, usando 5 como límite
        return productoRepository.countByStockLessThan(5);
    }

    // Opcional: Si usas el método que devuelve la lista
    @Override
    @Transactional(readOnly = true)
    public List<Producto> obtenerProductosBajoStock() {
        return productoRepository.findByStockLessThan(5);
    }
}