import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Importamos las funciones del "cerebro" del carrito
import { getCart, removeItemFromCart, clearCart } from "../../services/CartService";

export function Carrito() {
    const navigate = useNavigate();
    // Estado para guardar los productos del carrito
    const [carrito, setCarrito] = useState([]);

    // Carga inicial del carrito al montar el componente
    useEffect(() => {
        const items = getCart();
        setCarrito(items);
        
        // Opcional: Escuchar eventos de actualización del carrito desde otras partes de la app
        // Esto ayudará a que el contador del Navbar se actualice si estás en la página del carrito
        const handleCartUpdate = () => {
            setCarrito(getCart());
        };
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []); 

    // Lógica para eliminar un producto del carrito
    const handleEliminar = (productoId) => {
        removeItemFromCart(productoId);
        setCarrito(getCart()); // Actualizamos el estado local para que la UI reaccione
    };

    // Lógica para vaciar todo el carrito
    const handleLimpiar = () => {
        clearCart();
        setCarrito([]); // Vaciamos el estado local
    };

    // Calcula el total a pagar sumando precio * cantidad de cada producto
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
                                                onError={(e) => { e.target.onerror = null; e.target.src="/placeholder.png"; }}
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
                            <button className="btn btn-danger me-2" onClick={handleLimpiar}>
                                <i className="bi bi-trash3 me-1"></i> Vaciar carrito
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={() => {
                                    alert("¡Gracias por tu compra! (Lógica de pago y stock pendiente)");
                                    handleLimpiar();
                                    navigate('/'); 
                                }}
                            >
                                <i className="bi bi-credit-card me-1"></i> Pagar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Carrito;