// src/pages/productos/ProductListByCategory.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams para leer el ID de la URL
// 1. Importamos la función de servicio que creamos
import { getProductosPorCategoria } from '../../services/ProductService';
// 2. Importamos el nuevo CSS
import './ProductListByCategory.css';
// 3. Importamos la lógica del carrito que creamos
import { addItemToCart } from '../../services/CartService';
import { ProductoCard } from '../../componentes/productos/ProductoCard'; // Importamos la tarjeta reutilizable

export const ProductListByCategory = () => {
    // 4. Obtenemos el ID de la categoría desde la URL (ej. el '5')
    const { id } = useParams();

    // Estados para los productos, carga y errores
    const [productos, setProductos] = useState([]);
    const [categoriaNombre, setCategoriaNombre] = useState('Categoría');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 5. Hook para cargar los productos cuando el ID cambia
    useEffect(() => {
        const cargarProductos = async () => {
            setLoading(true);
            setError(null);
            try {
                // Llamamos al servicio con el ID de la categoría (Req 2.7)
                const data = await getProductosPorCategoria(id);
                setProductos(data);

                // Obtenemos el nombre de la categoría del primer producto
                if (data.length > 0 && data[0].categoria) {
                    setCategoriaNombre(data[0].categoria.nombre);
                } else {
                    // Si no hay productos, mostramos un nombre genérico
                    setCategoriaNombre(`Categoría (ID: ${id})`);
                }
            } catch (err) {
                console.error("Error cargando productos por categoría:", err);
                setError(`No se pudieron cargar los productos. ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) { // Solo carga si hay un ID en la URL
            cargarProductos();
        } else {
            setError("ID de categoría no encontrado en la URL.");
            setLoading(false);
        }
    }, [id]); // Se ejecuta cada vez que el 'id' de la URL cambie

    // --- Renderizado Condicional (Carga y Error) ---
    if (loading) {
        return (
            <div className="container text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return <div className="container alert alert-danger my-5">{error}</div>;
    }

    // --- Renderizado Principal (Las Cards de Productos) ---
    return (
        <div className="container catalogo-container my-5">
            <h2 className="mb-4 text-center">{categoriaNombre}</h2>

            {productos.length === 0 ? (
                <p className="text-center">No hay productos disponibles en esta categoría.</p>
            ) : (
                // 6. Usamos el grid para mostrar las tarjetas
                <section className="catalogo-grid">
                    {productos.map((producto) => (
                        // 7. Usamos el componente Card reutilizable
                        <ProductoCard key={producto.id} producto={producto} />
                    ))}
                </section>
            )}

            {/* Botón para volver al catálogo principal */}
            <div className="text-center mt-5">
                <Link to="/" className="btn btn-secondary">&laquo; Volver a Categorías</Link>
            </div>
        </div>
    );
};

// Exportación por defecto
export default ProductListByCategory;