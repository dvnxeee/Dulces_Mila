import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listarTodas as listarCategorias } from '../../services/CategoriaService';
import "./Catalogo.css";

export function Catalogo() {
    const navigate = useNavigate();

    // 1. Estado para almacenar las categorías de la API
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Hook para cargar las categorías al iniciar
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                // Llama a la función del servicio que hace GET /api/categorias
                const data = await listarCategorias();
                setCategorias(data);
            } catch (err) {
                console.error("Error al cargar categorías del backend:", err);
                setError("No se pudieron cargar las categorías del servidor. ¿Backend encendido?");
            } finally {
                setLoading(false);
            }
        };
        cargarCategorias();
    }, []); // El array vacío [] asegura que se ejecute solo una vez

    // 3. Manejo de estados de carga y error
    if (loading) {
        return (
            <section id="productos" className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Cargando categorías...</span>
                </div>
            </section>
        );
    }

    if (error) {
        // Muestra un mensaje de error si falla la conexión
        return <section id="productos"><div className="container"><h2>{error}</h2></div></section>;
    }

    return (
        <section id="productos">
            <div className="container">
                <h2>Nuestros productos</h2>
                {/* 4. Renderizado Dinámico de las categorías */}
                <div className="d-flex flex-wrap justify-content-center"> {/* Usa flexbox para alinear */}
                    {categorias.length === 0 ? (
                        <p>No hay categorías disponibles.</p>
                    ) : (
                        categorias.map((cat, index) => (
                            // Creamos un DIV por cada categoría que vino de la base de datos
                            <div
                                key={cat.id}
                                className="cart" // Mantenemos la clase CSS de tu compañero
                            // 💡 Nota: La imagen de fondo se maneja en el CSS con :nth-child
                            >
                                <h3>{cat.nombre}</h3>
                                {/* Texto estático */}
                                <p style={{ display: 'block' }}> {/* Hacemos visible el párrafo */}
                                    Descubre nuestra variedad de {cat.nombre.toLowerCase()}.
                                </p>
                                {/* La navegación debe ir a una ruta que filtre por ID */}
                                <button onClick={() => navigate(`/productos/categoria/${cat.id}`)}>+ info</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default Catalogo;