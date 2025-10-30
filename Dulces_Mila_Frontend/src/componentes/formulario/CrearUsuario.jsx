import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importamos la función 'createUser' del servicio
import { createUser } from '../../services/UserService'; 
// 2. Importamos las constantes de Roles
import { ROL } from '../../utils/Constants'; 
import './CrearUsuario.css';

// Opciones de Roles para el <select>
const ROLES_DISPONIBLES = [
    { value: ROL.CLIENTE, label: 'Cliente' },
    { value: ROL.VENDEDOR, label: 'Vendedor' },
    { value: ROL.SUPER_ADMIN, label: 'Super Administrador' }
];

export function CrearUsuario() {
    const navigate = useNavigate();
    
    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contraseña: '',
        rol: ROL.CLIENTE, // Valor por defecto
        estado: 'ACTIVO' // Se envía como ACTIVO por defecto
    });

    // Estados para manejar el feedback (errores, carga)
    const [validationErrors, setValidationErrors] = useState({}); // Errores específicos de campos
    const [generalError, setGeneralError] = useState(null); // Errores generales (conexión, 500)
    const [isLoading, setIsLoading] = useState(false);

    // Maneja el cambio en todos los inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpia el error de validación de ese campo cuando el usuario escribe
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita recarga de página
        setIsLoading(true);
        setGeneralError(null);
        setValidationErrors({}); // Limpia errores previos

        try {
            // 3. Llama a la función 'createUser' del servicio con los datos del formulario
            const response = await createUser(formData);

            alert(`Usuario "${response.nombre}" creado exitosamente con ID: ${response.id}.`);
            
            // 4. Redirige a la tabla de gestión de usuarios
            navigate('/administrador'); // Ajusta esta ruta si es diferente

        } catch (error) {
            console.error("Error al crear usuario:", error);
            
            // 5. Manejo de Errores del Backend
            if (typeof error === 'object' && error !== null && !error.message) { 
                // Si 'error' es un objeto (viene de Axios con status 400), es un mapa de errores de validación
                setValidationErrors(error); 
                setGeneralError("Por favor, corrija los errores en el formulario.");
            } else {
                // Si es un string u otro tipo, es un error general (ej. 500, red)
                setGeneralError(error.message || "Error al crear el usuario. Verifique la conexión o contacte al administrador.");
            }
        } finally {
            setIsLoading(false); // Termina la carga
        }
    };

    // Función auxiliar para clases de error en inputs
    const getErrorClass = (fieldName) => {
        return validationErrors[fieldName] ? 'is-invalid' : '';
    };

    // --- Renderizado del Formulario ---
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6"> {/* Ajusta el tamaño si es necesario */}
                    <div className="card shadow-sm"> {/* Sombra suave */}
                        <div className="card-header bg-success text-white">
                            <h4><i className="bi bi-person-plus-fill me-2"></i> Crear Nuevo Usuario</h4>
                        </div>
                        <div className="card-body">
                            
                            {/* Mensaje de Error General */}
                            {generalError && <div className="alert alert-danger py-2">{generalError}</div>}

                            <form onSubmit={handleSubmit} noValidate> {/* noValidate para que las validaciones del backend tengan prioridad */}
                                
                                {/* Campo NOMBRE */}
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        className={`form-control ${getErrorClass('nombre')}`}
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required 
                                    />
                                    {/* Mensaje de error específico */}
                                    {validationErrors.nombre && <div className="invalid-feedback d-block">{validationErrors.nombre}</div>} 
                                </div>

                                {/* Campo EMAIL */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${getErrorClass('email')}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    />
                                    {validationErrors.email && <div className="invalid-feedback d-block">{validationErrors.email}</div>}
                                </div>
                                
                                {/* Campo CONTRASEÑA */}
                                <div className="mb-3">
                                    <label htmlFor="contraseña" className="form-label">Contraseña <span className="text-danger">*</span></label>
                                    <input
                                        type="password"
                                        id="contraseña"
                                        className={`form-control ${getErrorClass('contraseña')}`}
                                        name="contraseña"
                                        value={formData.contraseña}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                        aria-describedby="passwordHelp"
                                    />
                                    {/* Mensaje de ayuda y error */}
                                    <div id="passwordHelp" className="form-text">Debe tener al menos 8 caracteres.</div>
                                    {validationErrors.contraseña && <div className="invalid-feedback d-block">{validationErrors.contraseña}</div>}
                                </div>
                                
                                {/* Campo ROL */}
                                <div className="mb-4"> {/* Más espacio antes de los botones */}
                                    <label htmlFor="rol" className="form-label">Rol <span className="text-danger">*</span></label>
                                    <select
                                        id="rol"
                                        className={`form-select ${getErrorClass('rol')}`}
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        required
                                    >
                                        {/* Mapea las opciones desde ROLES_DISPONIBLES */}
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
                                        // Vuelve a la página anterior o al dashboard
                                        onClick={() => navigate(-1)} 
                                        disabled={isLoading}>
                                        <i className="bi bi-arrow-left-circle me-1"></i> Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-success"
                                        disabled={isLoading}>
                                        {isLoading ? 
                                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...</> 
                                            : <><i className="bi bi-check-circle me-1"></i> Crear Usuario</>
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
export default CrearUsuario;