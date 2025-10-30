// src/componentes/formulario/Registro.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../../services/UserService'; // Reutilizamos el servicio
import { ROL, CODIGO_VENDEDOR_SECRETO } from '../../utils/Constants'; // Importamos roles y el código
import './Registro.css'; // ⬅️ Importa el CSS que creaste

export function Registro() {
    const navigate = useNavigate();

    // Estados para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contraseña: '',
        codigoVendedor: '' // Estado para el campo secreto
    });

    // Estados para UI
    const [validationErrors, setValidationErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Maneja el cambio en todos los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpia el error de validación cuando el usuario escribe
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); setGeneralError(null); setValidationErrors({});

        // --- Lógica de Diferenciación de Rol ---
        let rolParaRegistrar = ROL.CLIENTE; // 1. Por defecto es Cliente

        // 2. Comprueba si el código de vendedor es correcto
        if (formData.codigoVendedor === CODIGO_VENDEDOR_SECRETO) {
            rolParaRegistrar = ROL.VENDEDOR; // 3. Si es correcto, cambia el rol
        } else if (formData.codigoVendedor !== '') {
            // 4. (Opcional) Si escribió algo pero está mal, da error
            setValidationErrors({ codigoVendedor: "El código de vendedor no es válido." });
            setIsLoading(false);
            return; // Detiene el envío
        }
        // --- Fin Lógica de Rol ---

        // Preparamos los datos para el backend
        const datosRegistro = {
            nombre: formData.nombre,
            email: formData.email,
            contraseña: formData.contraseña,
            rol: rolParaRegistrar,
            estado: 'ACTIVO' // Nuevos usuarios siempre activos
        };

        try {
            await createUser(datosRegistro); // Llama a POST /api/usuarios
            alert(`¡Registro exitoso como ${rolParaRegistrar.toLowerCase()}! Ahora puedes iniciar sesión.`);
            navigate('/login'); // Redirige al login
        } catch (err) {
            if (typeof err === 'object' && err !== null && !err.message) {
                setValidationErrors(err);
                setGeneralError("Por favor, corrige los errores.");
            } else {
                setGeneralError(err.message || "Error al registrar.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Función auxiliar para clases de Bootstrap (feedback visual)
    const getErrorClass = (fieldName) => {
        return validationErrors[fieldName] ? 'is-invalid' : '';
    };

    return (
        // Usamos el ID #Formulario para que Registro.css aplique los estilos
        <section id="Formulario">
            <div className="container">
                <h3><em>Registro</em></h3>
                <p className="text-muted small">Crea tu cuenta para comprar.</p>

                {generalError && <div className="alert alert-danger p-2">{generalError}</div>}

                <form id="MiFormulario" onSubmit={handleSubmit} noValidate>

                    {/* Campo NOMBRE */}
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre:</label>
                        <input type="text" id="nombre" name="nombre"
                            className={`form-control ${getErrorClass('nombre')}`}
                            value={formData.nombre} onChange={handleChange}
                            disabled={isLoading} required
                        />
                        {validationErrors.nombre && <div className="invalid-feedback d-block text-warning">{validationErrors.nombre}</div>}
                    </div>

                    {/* Campo EMAIL */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" id="email" name="email"
                            className={`form-control ${getErrorClass('email')}`}
                            value={formData.email} onChange={handleChange}
                            disabled={isLoading} required
                        />
                        {validationErrors.email && <div className="invalid-feedback d-block text-warning">{validationErrors.email}</div>}
                    </div>

                    {/* Campo CONTRASEÑA */}
                    <div className="mb-3">
                        <label htmlFor="contraseña" className="form-label">Contraseña:</label>
                        <input type="password" id="contraseña" name="contraseña"
                            className={`form-control ${getErrorClass('contraseña')}`}
                            value={formData.contraseña} onChange={handleChange}
                            disabled={isLoading} required
                        />
                        <div className="form-text">Debe tener al menos 8 caracteres.</div>
                        {validationErrors.contraseña && <div className="invalid-feedback d-block text-warning">{validationErrors.contraseña}</div>}
                    </div>

                    {/* Campo CÓDIGO VENDEDOR */}
                    <div className="mb-4">
                        <label htmlFor="codigoVendedor" className="form-label">Código de Vendedor (Opcional)</label>
                        <input type="text" id="codigoVendedor" name="codigoVendedor"
                            className={`form-control ${getErrorClass('codigoVendedor')}`}
                            value={formData.codigoVendedor} onChange={handleChange}
                            placeholder="Ingresa solo si eres vendedor"
                            disabled={isLoading}
                        />
                        {validationErrors.codigoVendedor && <div className="invalid-feedback d-block text-warning">{validationErrors.codigoVendedor}</div>}
                    </div>

                    {/* Botones */}
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to="/login" style={{ color: '#FFF8E8' }}>¿Ya tienes cuenta?</Link>
                        <input type="submit" value={isLoading ? 'Registrando...' : 'Registrarse'} id="enviar" disabled={isLoading} />
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Registro;