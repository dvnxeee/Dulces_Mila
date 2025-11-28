import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importamos la función para obtener el conteo del carrito
import { getCartItemCount } from '../../services/CartService'; 
import './navbar.css'; 

export function Navbar() {
    const navigate = useNavigate();
    
    const [usuario, setUsuario] = useState(null);
    const [cartCount, setCartCount] = useState(0); // Estado para el contador

    // Función para actualizar el contador del carrito
    const updateCartCount = async () => {
        try {
            const count = await getCartItemCount(); // Espera la respuesta (Local o Nube)
            setCartCount(count);
        } catch (error) {
            console.error("Error actualizando contador:", error);
        }
    };

    // Hook principal
    useEffect(() => {
        // Cargar usuario
        const usuarioGuardado = localStorage.getItem('user');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        
        // Cargar contador inicial
        updateCartCount();

        // Escuchar cambios en el carrito (Evento personalizado)
        // Esto permite que cuando ProductoCard agregue algo, el Navbar se actualice
        window.addEventListener('cartUpdated', updateCartCount);

        // Limpieza al desmontar
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []); 

    const handleLogout = () => {
        localStorage.removeItem('user'); 
        window.location.href = '/'; 
    };

    const isLoggedIn = usuario !== null;
    const isAdmin = isLoggedIn && (usuario.rol === 'VENDEDOR' || usuario.rol === 'SUPER_ADMIN');

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">Dulces Mila 🍮</Link>
                <button
                    className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#menuNav" aria-controls="menuNav"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menuNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0"> 
                        <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/quienes-somos">¿Quiénes Somos?</Link></li>
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
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownUser" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                   <i className="bi bi-person-circle me-1"></i> Hola, {usuario.nombre}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownUser">
                                    <li><hr className="dropdown-divider"/></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/registro"><i className="bi bi-person-plus-fill me-1"></i> Registrarse</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/login"><i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión</Link></li>
                            </>
                        )}
                         
                        {!isAdmin && (
                             <li className="nav-item ms-lg-2">
                                 <Link className="btn btn-outline-dark btn-sm" to="/carrito">
                                    <i className="bi bi-cart me-1"></i> Carro 
                                    <span className="badge bg-dark ms-1">{cartCount}</span> 
                                 </Link>
                             </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;