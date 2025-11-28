// src/pages/carrito/Carrito.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeItemFromCart, clearCart } from "../../services/CartService";
// Importamos el servicio de ventas (¡Esto es lo que te falta!)
import { realizarVenta } from "../../services/VentaService";

export function Carrito() {
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);

    // Estado para bloquear el botón mientras procesa la compra
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            const items = await getCart(); // Usamos await
            setCarrito(items);
        };
        cargar();
    }, []);

    const handleEliminar = (productoId) => {
        removeItemFromCart(productoId);
        setCarrito(getCart());
    };

    const handleLimpiar = () => {
        clearCart();
        setCarrito([]);
    };

    // Nueva función para procesar el pago real
    const handlePagar = async () => {
        // Verificación de seguridad simple
        const user = localStorage.getItem('user');
        if (!user) {
            alert("Debes iniciar sesión para realizar una compra.");
            navigate('/login');
            return;
        }

        if (!window.confirm(`¿Confirmar compra por un total de $${total}?`)) {
            return;
        }

        setProcesando(true); // Activa spinner o deshabilita botón

        try {
            // Llamamos al backend (Spring Boot)
            // Esto ejecuta la lógica "complicada" de restar stock y guardar boleta
            const ventaRealizada = await realizarVenta(carrito);

            // Si todo sale bien:
            alert(`¡Compra exitosa! N° de Boleta: ${ventaRealizada.id}\nGracias por tu preferencia.`);

            handleLimpiar(); // Vacía el carrito local
            navigate('/'); // Redirige al inicio

        } catch (error) {
            console.error("Error al pagar:", error);
            alert(error.message || "Hubo un problema al procesar tu compra.");
        } finally {
            setProcesando(false); // Reactiva el botón
        }
    };

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    return (
        <section className="container my-5" style={{ minHeight: '60vh' }}>
            <h2 className="mb-4">🛒 Carrito de Compras</h2>

            {carrito.length === 0 ? (
                <div className="alert alert-info">
                    <p className="mb-0">No hay productos en el carrito.</p>
                    <Link to="/" className="alert-link">Volver al catálogo</Link>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Precio Unit.</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Subtotal</th>
                                <th scope="col">Quitar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={p.imagen ? `http://localhost:8080${p.imagen}` : '/placeholder.png'}
                                                alt={p.nombre}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                                            />
                                            <span className="ms-3 fw-bold">{p.nombre}</span>
                                        </div>
                                    </td>
                                    <td>${p.precio}</td>
                                    <td>{p.cantidad}</td>
                                    <td>${p.precio * p.cantidad}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleEliminar(p.id)}
                                            title="Quitar producto"
                                            disabled={procesando}
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {carrito.length > 0 && (
                <div className="mt-4">
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">Total a pagar: ${total}</h3>
                        <div className="acciones">
                            <button
                                className="btn btn-danger me-2"
                                onClick={handleLimpiar}
                                disabled={procesando}
                            >
                                <i className="bi bi-trash3 me-1"></i> Vaciar carrito
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={handlePagar} // Usa la función real
                                disabled={procesando}
                            >
                                {procesando ? (
                                    <span><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</span>
                                ) : (
                                    <span><i className="bi bi-credit-card me-1"></i> Pagar</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Carrito;