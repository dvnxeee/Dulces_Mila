import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para leer ID de URL y redirigir
// 1. Importamos las funciones necesarias del servicio
import { getUserById, updateUser } from '../../services/UserService'; 
// 2. Importamos las constantes de Roles
import { ROL } from '../../utils/Constants'; 
// 3. Importamos el CSS (puedes usar el mismo que CrearUsuario o uno nuevo)
import './EditarUsuario.css';

// Opciones de Roles para el <select> (igual que en CrearUsuario)
const ROLES_DISPONIBLES = [
    { value: ROL.CLIENTE, label: 'Cliente' },
    { value: ROL.VENDEDOR, label: 'Vendedor' },
    { value: ROL.SUPER_ADMIN, label: 'Super Administrador' }
];

export function EditarUsuario() {
    // Hooks para obtener ID de URL y para navegar
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // Estados para los campos del formulario (inicializados vacíos)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rol: '' // El rol se cargará desde la API
        // No incluimos 'contraseña' aquí, la actualización es opcional y se maneja diferente
    });

    // Estados para manejar carga, guardado y errores
    const [loading, setLoading] = useState(true); // Empieza cargando los datos
    const [saving, setSaving] = useState(false); // Para deshabilitar botones al guardar
    const [error, setError] = useState(null); // Errores generales
    const [validationErrors, setValidationErrors] = useState({}); // Errores de validación

    // --- Carga Inicial de Datos del Usuario ---
    useEffect(() => {
        const cargarUsuario = async () => {
            setLoading(true);
            setError(null); // Limpia errores previos
            try {
                // 4. Llama a GET /api/usuarios/{id} usando el servicio
                const data = await getUserById(id); 
                // 5. Rellena el formulario con los datos recibidos
                setFormData({ 
                    nombre: data.nombre, 
                    email: data.email, 
                    rol: data.rol 
                }); 
            } catch (err) {
                console.error(`Error al cargar usuario ${id}:`, err);
                setError("No se pudo cargar la información del usuario. ¿El ID es correcto?");
            } finally {
                setLoading(false); // Termina la carga
            }
        };
        
        cargarUsuario(); // Ejecuta la carga
    }, [id]); // El array [id] significa: "Vuelve a ejecutar si el ID de la URL cambia"

    // --- Manejo de Cambios en el Formulario ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpia el error de validación de ese campo al escribir
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // --- Manejo del Envío del Formulario (Actualización) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); // Cambia a estado "guardando"
        setError(null);
        setValidationErrors({});

        // 6. Preparamos los datos a enviar (solo los campos editables)
        const datosParaActualizar = {
            nombre: formData.nombre,
            email: formData.email,
            rol: formData.rol,
            // Importante: No enviamos 'contraseña' aquí. 
            // La lógica del backend ya sabe ignorarla si no viene.
        };

        try {
            // 7. Llama a PUT /api/usuarios/{id} usando el servicio
            await updateUser(id, datosParaActualizar); 
            
            alert("Usuario actualizado exitosamente.");
            // 8. Redirige de vuelta a la lista de usuarios
            navigate('/administrador'); // Ajusta si la ruta es diferente

        } catch (err) {
            console.error(`Error al actualizar usuario ${id}:`, err);
            // 9. Manejo de Errores (Validación 400 u otros)
            if (typeof err === 'object' && err !== null && !err.message) { 
                setValidationErrors(err);
                setError("Por favor, corrija los errores en el formulario.");
            } else {
                setError(err.message || "Error al actualizar el usuario.");
            }
        } finally {
            setSaving(false); // Termina el estado "guardando"
        }
    };

    // --- Renderizado Condicional (Carga y Error) ---
    if (loading) {
        return <div className="container text-center my-5"><div className="spinner-border text-primary"></div><p>Cargando datos del usuario...</p></div>;
    }
    // Muestra error general solo si no hay errores de validación específicos
    if (error && !Object.keys(validationErrors).length > 0) { 
        return <div className="container alert alert-danger my-5">{error}</div>;
    }

    // --- Renderizado del Formulario de Edición ---
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h4><i className="bi bi-pencil-fill me-2"></i> Editar Usuario (ID: {id})</h4>
                        </div>
                        <div className="card-body">
                            {/* Muestra error general si existe Y hay errores de validación */}
                            {error && Object.keys(validationErrors).length > 0 && 
                                <div className="alert alert-warning py-2 small">{error}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                
                                {/* Campo NOMBRE */}
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        className={`form-control ${validationErrors.nombre ? 'is-invalid' : ''}`}
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        disabled={saving}
                                        required 
                                    />
                                    {validationErrors.nombre && <div className="invalid-feedback d-block">{validationErrors.nombre}</div>} 
                                </div>

                                {/* Campo EMAIL */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={saving}
                                        required
                                    />
                                    {validationErrors.email && <div className="invalid-feedback d-block">{validationErrors.email}</div>}
                                </div>
                                
                                {/* Campo ROL */}
                                <div className="mb-4">
                                    <label htmlFor="rol" className="form-label">Rol <span className="text-danger">*</span></label>
                                    <select
                                        id="rol"
                                        className={`form-select ${validationErrors.rol ? 'is-invalid' : ''}`}
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                        disabled={saving}
                                        required
                                    >
                                        {ROLES_DISPONIBLES.map(rol => (
                                            <option key={rol.value} value={rol.value}>{rol.label}</option>
                                        ))}
                                    </select>
                                    {validationErrors.rol && <div className="invalid-feedback d-block">{validationErrors.rol}</div>}
                                </div>

                                {/* Botones de Acción */}
                                <div className="d-flex justify-content-between pt-3 border-top">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => navigate('/administrador')} // Vuelve a la lista
                                        disabled={saving}>
                                        <i className="bi bi-x-circle me-1"></i> Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={saving}>
                                        {saving ? 
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> 
                                            : <><i className="bi bi-check-lg me-1"></i> Guardar Cambios</>
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exportación por defecto
export default EditarUsuario;