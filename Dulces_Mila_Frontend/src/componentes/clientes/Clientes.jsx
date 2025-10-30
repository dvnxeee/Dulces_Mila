import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
// 1. Importamos TODAS las funciones necesarias del servicio de usuario
import { getAllUsers, inhabilitarUser, habilitarUser, deleteUser } from '../../services/UserService';
import './Clientes.css'; // Asegúrate de tener el CSS

export function Clientes() {
    // Estado para guardar la lista de usuarios
    const [usuarios, setUsuarios] = useState([]);
    // Estados para control de carga y errores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Estado para el input de búsqueda/filtrado
    const [filtro, setFiltro] = useState('');
    const fetchedRef = useRef(false); // evita doble-fetch en StrictMode (dev)

    const cargarUsuarios = async () => {
        console.debug('cargarUsuarios called');
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsuarios(data);
        } catch (err) {
            console.error('Error al obtener usuarios:', err);
            setError('Error al cargar la lista de usuarios. Asegúrate de que el backend esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        cargarUsuarios();
    }, []); // El array vacío [] significa "ejecutar solo al inicio"

    // --- Funciones de Acción (con confirmación) ---

    // Cambiar Estado (Inhabilitar/Habilitar)
    const handleCambiarEstado = async (id, nombre, estadoActual) => {
        const nuevaAccion = estadoActual === 'ACTIVO' ? 'inhabilitar' : 'habilitar';
        const mensajeConfirm = `¿Estás seguro de ${nuevaAccion} al usuario "${nombre}"?`;

        // Confirmación del usuario
        if (window.confirm(mensajeConfirm)) {
            try {
                // Llama a la función del servicio correspondiente (inhabilitarUser o habilitarUser)
                if (estadoActual === 'ACTIVO') {
                    await inhabilitarUser(id);
                } else {
                    await habilitarUser(id);
                }
                alert(`Usuario ${nombre} ${nuevaAccion === 'inhabilitar' ? 'inhabilitado' : 'habilitado'} correctamente.`);
                cargarUsuarios(); // Recarga la tabla para ver el cambio
            } catch (err) {
                console.error(`Error al ${nuevaAccion}:`, err);
                alert(`Error al ${nuevaAccion} el usuario: ${err.message || 'Error desconocido'}`);
            }
        }
    };

    // Eliminar Físicamente (DELETE)
    const handleEliminar = async (id, nombre) => {
        // Confirmación del usuario
        if (window.confirm(`¿Estás seguro de ELIMINAR PERMANENTEMENTE al usuario "${nombre}"? Esta acción no se puede deshacer.`)) {
            try {
                // Llama a la función del servicio deleteUser
                await deleteUser(id);
                alert(`Usuario ${nombre} eliminado exitosamente.`);
                cargarUsuarios(); // Recarga la tabla
            } catch (err) {
                console.error('Error al eliminar:', err);
                alert(`Error al eliminar el usuario: ${err.message || 'Error desconocido'}`);
            }
        }
    };

    // --- Filtrado ---
    // Filtra la lista de usuarios basándose en el estado 'filtro'
    const usuariosFiltrados = usuarios.filter(user =>
        user.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        user.email.toLowerCase().includes(filtro.toLowerCase()) ||
        user.rol.toLowerCase().includes(filtro.toLowerCase()) // También filtra por rol
    );

    // --- Renderizado Condicional (Carga y Error) ---
    if (loading) {
        return (
            <div className="container text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando usuarios...</p>
            </div>
        );
    }

    if (error) {
        return <div className="container alert alert-danger my-5">{error}</div>;
    }

    // --- Renderizado Principal (Tabla) ---
    return (
        <div className="container-fluid mi-tabla px-4">
            <h3 style={{ marginBottom: '20px' }}>Gestión de Usuarios</h3>
            <div className="row mb-3 align-items-center">
                <div className="col-md-8">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Buscar por nombre, email o rol..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>
                <div className="col-md-4 text-end">
                    <Link className="btn btn-sm btn-success" to="/crear-usuario">
                        <i className="bi bi-plus-circle me-1"></i> Crear Nuevo Usuario
                    </Link>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-hover table-sm align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((user) => (
                            // Estilo para usuarios inactivos
                            <tr key={user.id} style={{ opacity: user.estado === 'ACTIVO' ? 1 : 0.6 }}>
                                <td>{user.id}</td>
                                <td>{user.nombre}</td>
                                <td>{user.email}</td>
                                <td>{user.rol}</td>
                                <td>
                                    <span className={`badge ${user.estado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'}`}>
                                        {user.estado}
                                    </span>
                                </td>
                                <td>
                                    <Link
                                        className="btn btn-sm btn-outline-primary me-2"
                                        title="Editar Usuario"
                                        // Ruta al formulario de edición (Paso 4)
                                        to={`/editar-usuario/${user.id}`}>
                                        <i className="bi bi-pencil-square"></i> Editar
                                    </Link>
                                    <button
                                        className={`btn btn-sm ${user.estado === 'ACTIVO' ? 'btn-outline-warning' : 'btn-outline-info'}`}
                                        title={user.estado === 'ACTIVO' ? 'Inhabilitar Usuario' : 'Habilitar Usuario'}
                                        // Llama a la función handleCambiarEstado con los datos necesarios
                                        onClick={() => handleCambiarEstado(user.id, user.nombre, user.estado)}>
                                        {user.estado === 'ACTIVO' ? <i className="bi bi-slash-circle"></i> : <i className="bi bi-check-circle"></i>}
                                        {user.estado === 'ACTIVO' ? ' Inhabilitar' : ' Habilitar'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        title="Eliminar Usuario Permanentemente"
                                        // Llama a la función handleEliminar
                                        onClick={() => handleEliminar(user.id, user.nombre)}>
                                        <i className="bi bi-trash3"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {usuariosFiltrados.length === 0 && !loading && (
                <p className="text-center text-muted mt-3">
                    {filtro ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados.'}
                </p>
            )}
        </div>
    );
}

export default Clientes;