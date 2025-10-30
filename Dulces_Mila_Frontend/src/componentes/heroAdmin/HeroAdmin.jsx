import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para los enlaces rápidos
// 1. Importamos las funciones de estadísticas de los servicios
import { getTotalProductsCount, getLowStockProducts } from '../../services/ProductService';
import { getTotalUsersCount } from '../../services/UserService';
// 2. Importamos el CSS (Asegúrate de crearlo)
import './HeroAdmin.css';

export function HeroAdmin() {
    // Estados para guardar las estadísticas
    const [stats, setStats] = useState({
        totalProductos: 0,
        totalUsuarios: 0,
        productosBajoStock: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook para cargar todas las estadísticas al montar
    useEffect(() => {
        const cargarEstadisticas = async () => {
            setLoading(true);
            setError(null);
            try {
                // 3. Hacemos las llamadas al backend (ahora devuelven números)
                const [productosCount, usuariosCount, lowStockCount] = await Promise.all([
                    getTotalProductsCount(),
                    getTotalUsersCount(),
                    getLowStockProducts()
                ]);

                // 4. CORRECCIÓN: Actualizamos el estado directamente con los números
                setStats({
                    totalProductos: productosCount,
                    totalUsuarios: usuariosCount,
                    productosBajoStock: lowStockCount
                });

            } catch (err) {
                console.error("Error cargando estadísticas del dashboard:", err);
                setError(`No se pudieron cargar las estadísticas: ${err.message || 'Verifique conexión con backend'}`);
            } finally {
                setLoading(false);
            }
        };

        cargarEstadisticas();
    }, []); // Se ejecuta solo una vez

    // Renderizado condicional mientras carga o si hay error
    if (loading) {
        return (
            <div className="container text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando Dashboard...</p>
            </div>
        );
    }
    if (error) {
        return <div className="container alert alert-warning my-5">{error}</div>;
    }

    // --- Renderizado del Dashboard ---
    return (
        <section className="container py-4">
            <h2 className="mb-4">Dashboard Administrativo</h2>

            <div className="row">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3 shadow">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-uppercase mb-1 small">Productos Totales</div>
                                    <div className="h4 mb-0 fw-bold">{stats.totalProductos}</div>
                                </div>
                                <div className="col-auto"><i className="bi bi-box-seam fs-1 opacity-50"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3 shadow">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-uppercase mb-1 small">Usuarios Registrados</div>
                                    <div className="h4 mb-0 fw-bold">{stats.totalUsuarios}</div>
                                </div>
                                <div className="col-auto"><i className="bi bi-people-fill fs-1 opacity-50"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`card text-white ${stats.productosBajoStock > 0 ? 'bg-warning' : 'bg-secondary'} mb-3 shadow`}>
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-uppercase mb-1 small">Productos Stock Bajo (&lt;5)</div>
                                    <div className="h4 mb-0 fw-bold">{stats.productosBajoStock}</div>
                                </div>
                                <div className="col-auto">
                                    <i className={`bi ${stats.productosBajoStock > 0 ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} fs-1 opacity-50`}></i>
                                </div>
                            </div>
                        </div>
                        {stats.productosBajoStock > 0 && (
                            <Link to="/productos?filtro=stockbajo" className="card-footer text-white small text-decoration-none">
                                Ver detalles <i className="bi bi-arrow-right-circle"></i>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center d-flex flex-column justify-content-between p-4">
                            <div>
                                <i className="bi bi-box-seam fs-1 text-primary mb-3"></i>
                                <h5 className="card-title mb-3">Gestión de Productos</h5>
                                <p className="card-text small text-muted mb-4">Administra el inventario: crea, edita, activa/desactiva productos y gestiona imágenes.</p>
                            </div>
                            <Link to="/productos" className="btn btn-primary mt-auto px-4">
                                Ir a Productos
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center d-flex flex-column justify-content-between p-4">
                            <div>
                                <i className="bi bi-people-fill fs-1 text-success mb-3"></i>
                                <h5 className="card-title mb-3">Gestión de Usuarios</h5>
                                <p className="card-text small text-muted mb-4">Administra los usuarios del sistema: crea, edita roles y gestiona el estado (activo/inactivo).</p>
                            </div>
                            <Link to="/clientes-admin" className="btn btn-success mt-auto px-4">
                                Ir a Usuarios
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default HeroAdmin;