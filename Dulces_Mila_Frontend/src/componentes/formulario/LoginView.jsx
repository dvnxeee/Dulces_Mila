// src/componentes/formulario/LoginView.jsx

import React, { useState } from 'react';
// No importamos useNavigate porque usaremos window.location para forzar la recarga
import { login } from '../../services/UserService';
import { ROL } from '../../utils/Constants';
import './formulario.css';

export function LoginView() {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log("1. Iniciando proceso de login...");

        try {
            // 1. Llamamos al backend
            const userData = await login(email, contraseña);
            console.log("2. Respuesta del backend recibida:", userData);

            // 2. Guardamos en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            console.log("3. Usuario guardado en localStorage.");

            // 3. Verificamos el rol para redirigir
            // Usamos window.location.href para asegurar que el Navbar se actualice
            if (userData.rol === ROL.VENDEDOR || userData.rol === ROL.SUPER_ADMIN) {
                console.log("4. Redirigiendo a ADMINISTRADOR...");
                window.location.href = "/administrador";
            } else {
                console.log("4. Redirigiendo a HOME (Cliente)...");
                window.location.href = "/";
            }

        } catch (err) {
            console.error("❌ Error en el login:", err);
            setError(typeof err === 'string' ? err : "Error al iniciar sesión. Verifica tus credenciales.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setEmail('');
        setContraseña('');
        setError(null);
    };

    return (
        <section id="Formulario">
            <div className="container">
                <h3><em>¡Bienvenido!</em></h3>
                <p className="text-muted small">Ingresa tus credenciales para continuar.</p>

                {/* Mensaje de Error visible */}
                {error && (
                    <div className="alert alert-danger p-2 text-center" style={{ backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <form id="MiFormulario" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label><br />
                    <input
                        type="email" id="email" name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required disabled={loading}
                    /><br /><br />

                    <label htmlFor="contraseña">Contraseña:</label><br />
                    <input
                        type="password" id="contraseña" name="contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required disabled={loading}
                    /><br /><br />

                    <input
                        type="submit"
                        value={loading ? "Verificando..." : "Aceptar"}
                        id="enviar"
                        disabled={loading}
                        style={{ cursor: loading ? 'wait' : 'pointer' }}
                    />
                    <input
                        type="reset"
                        value="Limpiar"
                        id="limpiar"
                        onClick={handleReset}
                        disabled={loading}
                    />
                </form>
            </div>
        </section>
    );
}

export default LoginView;