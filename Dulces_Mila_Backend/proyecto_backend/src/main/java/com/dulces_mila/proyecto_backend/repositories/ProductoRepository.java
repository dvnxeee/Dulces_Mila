package com.dulces_mila.proyecto_backend.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.dulces_mila.proyecto_backend.entities.Categoria;
import com.dulces_mila.proyecto_backend.entities.Producto;

/**
 * Repositorio (DAO) para la entidad Producto.
 */
@Repository
public interface ProductoRepository extends CrudRepository<Producto, Long> {

    /**
     * Este método personalizado busca productos cuyo nombre 'contenga'
     * el texto que le pasamos.
     * El 'IgnoreCase' hace que no le importen mayúsculas/minúsculas.
     * (Cumple con "Búsqueda de productos por nombre")
     */
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Este método personalizado busca todos los productos que
     * pertenecen a una categoría específica.
     * (Cumple con "Filtro por categoría")
     */
    List<Producto> findByCategoria(Categoria categoria);

    // MÉTODO NUEVO PARA CONTAR TOTAL
    /**
     * Cuenta el número total de productos en el inventario.
     * @return El número total de productos.
     */
    long count(); 

    // MÉTODO NUEVO PARA STOCK BAJO (< 5)
    /**
     * Cuenta los productos cuyo stock es menor que un valor dado.
     * Usaremos 5 como valor (stock < 5).
     * @param stockLimite El número máximo de stock (excluyente).
     * @return El número de productos con stock bajo.
     */
    long countByStockLessThan(Integer stockLimite); 
    
    // Opcional: Si quieres devolver la lista completa en lugar de solo el número:
    List<Producto> findByStockLessThan(Integer stockLimite);

}