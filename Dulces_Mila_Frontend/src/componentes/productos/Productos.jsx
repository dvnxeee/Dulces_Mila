// src/componentes/productos/Productos.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProductos, inhabilitarProducto, habilitarProducto, deleteProducto } from '../../services/ProductService';
import './Productos.css'; //

export function Productos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState(''); 
    const location = useLocation();
    const navigate = useNavigate();

    // --- Carga de Datos (Tu código está bien) ---
    const cargarProductos = async () => {
        setLoading(true);
        setError(null);
        try {
            const [data] = await Promise.all([
                getProductos(),
                new Promise(resolve => setTimeout(resolve, 300)) 
            ]);
            setProductos(data);
        } catch (err) {
            setError('Error al cargar productos. Asegúrate de que el backend esté funcionando.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { cargarProductos(); }, []);

    // --- Funciones de Acción (Tu código está bien) ---
    const handleCambiarEstado = async (id, nombre, estadoActual) => {
        const nuevaAccion = estadoActual === 'ACTIVO' ? 'inhabilitar' : 'habilitar';
        if (window.confirm(`¿Seguro de ${nuevaAccion} "${nombre}"?`)) {
            try {
                if (estadoActual === 'ACTIVO') await inhabilitarProducto(id);
                else await habilitarProducto(id);
                alert(`Producto ${nuevaAccion === 'inhabilitar' ? 'inhabilitado' : 'habilitado'}.`);
                cargarProductos();
            } catch (err) { alert(`Error: ${err.message}`); }
        }
    };
    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿ELIMINAR PERMANENTEMENTE "${nombre}"?`)) {
            try {
                await deleteProducto(id);
                alert('Producto eliminado.');
                cargarProductos();
            } catch (err) { alert(`Error: ${err.message}`); }
        }
    };

    // --- Filtrado (Tu código está bien) ---
    const urlParams = new URLSearchParams(location.search);
    const filtroStock = urlParams.get('filtro') === 'stockbajo';
    const productosFiltrados = productos.filter(prod => {
        if (filtroStock) return prod.stock < 5;
        return prod.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
               (prod.categoria && prod.categoria.nombre.toLowerCase().includes(filtro.toLowerCase()));
    });
    const limpiarFiltroUrl = () => { navigate('/productos'); };

    // --- Renderizado Condicional (Tu código está bien) ---
    if (loading) {
        return (
            <div className="container text-center my-5" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando inventario...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container alert alert-danger my-5">
                {error}
                <button onClick={cargarProductos} className="btn btn-danger btn-sm ms-3">Reintentar</button>
            </div>
        );
    }

    // --- Renderizado Principal (Tabla) ---
    return (
        <div className="container-fluid mi-tabla px-4"> 
            
            <h3 style={{ marginBottom: '20px' }}>
                {filtroStock ? 'Inventario: Productos con Stock Crítico (<5)' : 'Inventario de Productos'}
            </h3>

            {/* Barra de Búsqueda y Botones (Sin cambios) */}
            <div className="row mb-3 align-items-center">
                <div className="col-md-8">
                    <input 
                        type="text" 
                        className="form-control form-control-sm"
                        placeholder={filtroStock ? "Mostrando filtro de stock bajo..." : "Buscar por nombre o categoría..."}
                        value={filtro} 
                        onChange={(e) => setFiltro(e.target.value)}
                        disabled={filtroStock} 
                    />
                </div>
                <div className="col-md-4 text-end">
                    {filtroStock ? (
                        <button className="btn btn-sm btn-warning" onClick={limpiarFiltroUrl}>
                            <i className="bi bi-x-circle me-1"></i> Quitar Filtro
                        </button>
                    ) : (
                        <Link className="btn btn-sm btn-success" to="/crear-producto">
                            <i className="bi bi-plus-circle me-1"></i> Crear Producto
                        </Link>
                    )}
                </div>
            </div>

            {/* Tabla Responsive */}
            <div className="table-responsive">
                <table className="table table-hover table-sm align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th> {/* ⬅️ CAMBIO: Alerta aquí */}
                            <th>Estado</th>
                            <th>Acciones</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((prod) => (
                            // --- ⬇️ CAMBIO 1: AÑADIR CLASE 'table-warning' A LA FILA ⬇️ ---
                            <tr 
                                key={prod.id} 
                                // Si el stock es menor a 5, aplica la clase de Bootstrap 'table-warning'
                                className={prod.stock < 5 ? 'table-warning' : ''} 
                                style={{ opacity: prod.estado === 'ACTIVO' ? 1 : 0.6 }}
                            >
                                <td>{prod.id}</td>
                                <td>
                                    <img
                                        src={prod.imagen ? `http://localhost:8080${prod.imagen}` : '/placeholder.png'}
                                        alt={prod.nombre}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                                    />
                                </td>
                                <td>{prod.nombre}</td>
                                <td>{prod.categoria ? prod.categoria.nombre : 'N/A'}</td>
                                <td>${prod.precio}</td>
                                
                                {/* --- ⬇️ CAMBIO 2: AÑADIR BADGE AL STOCK ⬇️ --- */}
                                <td>
                                    {prod.stock}
                                    {/* Si el stock es menor a 5, muestra el badge (Req 2.8) */}
                                    {prod.stock < 5 && (
                                        <span 
                                            className="badge bg-danger text-white ms-2" 
                                            title="Stock bajo">
                                            <i className="bi bi-exclamation-triangle-fill"></i>
                                        </span>
                                    )}
                                </td>
                                {/* --- ⬆️ FIN DE CAMBIOS ⬆️ --- */}

                                <td><span className={`badge ${prod.estado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'}`}>{prod.estado}</span></td>
                                <td>
                                    <Link className="btn btn-sm btn-outline-primary me-2" title="Editar" to={`/editar-producto/${prod.id}`}><i className="bi bi-pencil-square"></i></Link>
                                    <button className={`btn btn-sm ${prod.estado === 'ACTIVO' ? 'btn-outline-warning' : 'btn-outline-info'}`} title={prod.estado === 'ACTIVO' ? 'Inhabilitar' : 'Habilitar'} onClick={() => handleCambiarEstado(prod.id, prod.nombre, prod.estado)}>
                                        {prod.estado === 'ACTIVO' ? <i className="bi bi-slash-circle"></i> : <i className="bi bi-check-circle"></i>}
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => handleEliminar(prod.id, prod.nombre)}><i className="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {productosFiltrados.length === 0 && !loading && <p className="text-center text-muted mt-3">No se encontraron productos.</p>}
        </div>
    );
}

export default Productos;