import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/UserService';
import { ROL } from '../../utils/Constants';
import './formulario.css';

export function LoginView() { // O 'export function Form()'
    const navigate = useNavigate();

    // Estados
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    /**
     * Maneja el envío del formulario de login.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userData = await login(email, contraseña);
            localStorage.setItem('user', JSON.stringify(userData));

            // 3. ⬇️ --- CORRECCIÓN AQUÍ --- ⬇️
            // Reemplazamos navigate() por window.location.href
            // Esto fuerza un REFRESH COMPLETO de la página.

            if (userData.rol === ROL.VENDEDOR || userData.rol === ROL.SUPER_ADMIN) {
                // Si es Admin/Vendedor, recarga la página en el dashboard
                window.location.href = "/administrador";
            } else {
                // Si es CLIENTE, recarga la página en el Home
                window.location.href = "/";
            }

        } catch (err) { /* ... (manejo de error) ... */ }
        finally { setLoading(false); }
    };

    /**
     * ➡️ LÓGICA DE RESETEO CORREGIDA
     * Limpia los campos del formulario y los errores.
     */
    const handleReset = () => {
        setEmail('');
        setContraseña('');
        setError(null);
    };

    // --- Renderizado ---
    return (
        <section id="Formulario">
            <div className="container">
                <h3><em>¡Bienvenido!</em></h3>
                <p className="text-muted small">Ingresa tus credenciales para continuar.</p>

                {error && (
                    <div className="alert alert-danger p-2" role="alert" style={{ color: 'red' }}>
                        {error}
                    </div>
                )}

                <form id="MiFormulario" onSubmit={handleSubmit}>
                    {/* Campo Email */}
                    <label htmlFor="email">Email:</label><br />
                    <input
                        type="email" id="email" name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required disabled={loading}
                    /><br /><br />

                    {/* Campo Contraseña */}
                    <label htmlFor="contraseña">Contraseña:</label><br />
                    <input
                        type="password" id="contraseña" name="contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required disabled={loading}
                    /><br /><br />

                    {/* Botones */}
                    <input type="submit" value={loading ? "Verificando..." : "Aceptar"} id="enviar" disabled={loading} />
                    <input type="reset" value="Limpiar" id="limpiar" onClick={handleReset} disabled={loading} />
                </form>
            </div>
        </section>
    );
}

export default LoginView;