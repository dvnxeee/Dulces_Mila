import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Asegúrate de importar los iconos de Bootstrap en tu index.html o main.jsx
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
import './navbar.css'; // Mantenemos tu CSS local

export function Navbar() {
    const navigate = useNavigate();

    // Estado para guardar el objeto del usuario (si existe)
    const [usuario, setUsuario] = useState(null);

    // Lee el localStorage CADA VEZ que el componente se carga
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('user');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
    }, []); // El [] asegura que se ejecute solo al montar
    
    const handleLogout = () => {
        localStorage.removeItem('user'); // Borra la sesión
        // ⬇️ CORRECCIÓN: Forzamos recarga en la página de inicio
        window.location.href = '/'; 
    };

    // Variables de estado (ahora son reales)
    const isLoggedIn = usuario !== null;
    // Valida si es admin (VENDEDOR o SUPER_ADMIN) (Req 1.4)
    const isAdmin = isLoggedIn && (usuario.rol === 'VENDEDOR' || usuario.rol === 'SUPER_ADMIN');

    return (
        // Estilo: fondo blanco, sombra, pegajoso arriba
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    Dulces Mila 🍮
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menuNav"
                    aria-controls="menuNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menuNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/quienes-somos">¿Quiénes Somos?</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">

                        {isAdmin && (
                            <li className="nav-item">
                                <Link className="nav-link text-primary fw-bold" to="/administrador">
                                    <i className="bi bi-gear-fill me-1"></i> Gestión Admin
                                </Link>
                            </li>
                        )}

                        {isLoggedIn ? (
                            // --- SI ESTÁ LOGUEADO ---
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownUser" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                   <i className="bi bi-person-circle me-1"></i> Hola, {usuario.nombre}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownUser">
                                    <li><hr className="dropdown-divider"/></li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            // --- SI NO ESTÁ LOGUEADO ---
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/registro">
                                        <i className="bi bi-person-plus-fill me-1"></i> Registrarse
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
                                    </Link>
                                </li>
                            </>
                        )}
                        {!isAdmin && (
                             <li className="nav-item ms-lg-2">
                                 <Link className="btn btn-outline-dark btn-sm" to="/carrito">
                                    <i className="bi bi-cart me-1"></i> Carro <span className="badge bg-dark ms-1">0</span>
                                 </Link>
                             </li>
                        )}

                    </ul>
                </div>
            </div>
        </nav>
    );
}

// Exportación por defecto
export default Navbar;