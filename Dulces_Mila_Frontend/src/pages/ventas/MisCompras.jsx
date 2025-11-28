import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisCompras } from '../../services/VentaService'; // Tu servicio

export function MisCompras() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                // Llama al backend (GET /api/ventas/mis-compras)
                const data = await getMisCompras();
                setVentas(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el historial.");
            } finally {
                setLoading(false);
            }
        };
        cargarHistorial();
    }, []);

    if (loading) {
        return <div className="container text-center my-5"><div className="spinner-border text-primary"></div><p>Cargando historial...</p></div>;
    }

    if (error) {
        return <div className="container alert alert-danger my-5">{error}</div>;
    }

    return (
        <div className="container my-5">
            <h2 className="mb-4"><i className="bi bi-receipt me-2"></i>Mis Compras</h2>

            {ventas.length === 0 ? (
                <div className="alert alert-info">
                    No has realizado compras aún. <Link to="/" className="alert-link">Ir a comprar</Link>
                </div>
            ) : (
                <div className="accordion" id="accordionVentas">
                    {ventas.map((venta) => (
                        <div className="accordion-item" key={venta.id}>
                            <h2 className="accordion-header">
                                <button 
                                    className="accordion-button collapsed" 
                                    type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target={`#collapse${venta.id}`}
                                >
                                    <div className="d-flex w-100 justify-content-between me-3">
                                        <span><strong>Boleta #{venta.id}</strong></span>
                                        <span>{new Date(venta.fecha).toLocaleDateString()}</span>
                                        <span className="text-success fw-bold">${venta.total}</span>
                                    </div>
                                </button>
                            </h2>
                            <div id={`collapse${venta.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionVentas">
                                <div className="accordion-body">
                                    <h6 className="border-bottom pb-2">Detalle de Productos:</h6>
                                    <ul className="list-group list-group-flush mb-3">
                                        {venta.detalles.map((detalle) => (
                                            <li key={detalle.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>
                                                    {detalle.producto.nombre} <span className="text-muted">x{detalle.cantidad}</span>
                                                </span>
                                                <span>${detalle.subtotal}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-end">
                                        <p className="mb-0 text-muted small">Neto: ${venta.montoNeto} | IVA (19%): ${venta.montoIva}</p>
                                        <h5 className="mt-1">Total Pagado: ${venta.total}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MisCompras;