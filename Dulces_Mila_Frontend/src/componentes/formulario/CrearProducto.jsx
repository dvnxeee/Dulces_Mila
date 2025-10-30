// src/componentes/crearProducto/CrearProducto.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importamos las funciones necesarias de los servicios
import { createProducto, uploadImage } from '../../services/ProductService';
import { listarTodas as getCategorias } from '../../services/CategoriaService';
// 2. Importamos las constantes
import { ESTADO } from '../../utils/Constants';
// 3. Importamos el CSS (Asegúrate que exista en esta ruta)
import './CrearProducto.css';

// ❌ NO DEBE IMPORTAR NAVBAR NI FOOTER AQUÍ

export function CrearProducto() {
    const navigate = useNavigate();

    // --- Estados del Componente ---

    // Estado para los datos del formulario (incluye todos los campos del backend [cite: 22-23])
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '', // ⬅️ Requerido por Rúbrica [cite: 22-23]
        categoria: '', // Guardará el ID de la categoría seleccionada
        estado: ESTADO.ACTIVO, // ⬅️ Requerido por Rúbrica [cite: 22-23]
        imagen: '' // Guardará la URL devuelta por el backend
    });

    // Estado para el archivo de imagen (binario)
    const [archivoImagen, setArchivoImagen] = useState(null);

    // Estado para guardar la lista de categorías (para el <select>)
    const [categorias, setCategorias] = useState([]);

    // Estados para controlar la UI (carga, errores)
    const [loading, setLoading] = useState(false); // Para deshabilitar botones mientras se guarda
    const [loadingCategorias, setLoadingCategorias] = useState(true); // Para el <select> de categorías
    const [error, setError] = useState(null); // Errores generales (conexión, 500)
    const [validationErrors, setValidationErrors] = useState({}); // Errores específicos de campos (400)

    // --- Efecto para Cargar Categorías ---
    useEffect(() => {
        const cargarCategorias = async () => {
            setLoadingCategorias(true);
            try {
                // Llama a GET /api/categorias
                const data = await getCategorias();
                setCategorias(data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setError("No se pudieron cargar las categorías. ¿Backend encendido?");
            } finally {
                setLoadingCategorias(false);
            }
        };
        cargarCategorias();
    }, []); // El array vacío [] asegura que se ejecute solo una vez al montar

    // --- Manejadores de Eventos ---

    // Maneja cambios en inputs de texto, número y select
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpia el error de validación de ese campo si el usuario empieza a corregir
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Maneja la selección del archivo de imagen
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setArchivoImagen(e.target.files[0]);
        } else {
            setArchivoImagen(null);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            let urlImagen = '';

            // 1. Subir la imagen SI se seleccionó un archivo (Req 2.3) [cite: 56]
            if (archivoImagen) {
                const imgFormData = new FormData();
                imgFormData.append('file', archivoImagen);

                // Llama a POST /api/productos/upload usando el servicio
                const resUpload = await uploadImage(imgFormData);
                urlImagen = resUpload.url;
            }

            // 2. Preparar el objeto JSON para el backend
            const productoParaEnviar = {
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim(),
                precio: parseInt(formData.precio) || 0,
                stock: parseInt(formData.stock) || 0, // ⬅️ Incluye Stock
                estado: formData.estado,           // ⬅️ Incluye Estado
                imagen: urlImagen,               // ⬅️ URL del backend
                categoria: { id: parseInt(formData.categoria) }
            };

            // 3. Validación de Categoría (Req 2.6) [cite: 73-77]
            if (!productoParaEnviar.categoria.id) {
                // Lanza un error local si no se selecciona categoría
                throw { categoria: "Debes seleccionar una categoría." };
            }

            // 4. Crear el producto (Req 2.3) [cite: 54-59]
            await createProducto(productoParaEnviar);

            alert('Producto creado exitosamente.');
            navigate('/productos'); // Redirige a la tabla de inventario

        } catch (err) {
            // 5. Manejo de Errores (Req 2.6) [cite: 73-77]
            if (typeof err === 'object' && err !== null && !err.message) {
                setValidationErrors(err);
                setError("Por favor, revisa los errores en el formulario.");
            } else {
                setError(err.message || 'No se pudo crear el producto. Error de conexión.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para el botón Cancelar
    const handleCancel = () => {
        if (window.confirm('¿Estás seguro de cancelar? Se perderán los datos no guardados.')) {
            navigate('/administrador'); // Vuelve al dashboard
        }
    };

    const getErrorClass = (fieldName) => validationErrors[fieldName] ? 'is-invalid' : '';

    // --- Renderizado (Fusionado con CSS de tu compañero) ---
    return (
        <div className="crear-producto-container">
            <div className="form-card">
                <h2>Crear Producto</h2>
                {error && <div className="error-message">{error} <button onClick={() => setError(null)} className="error-close">×</button></div>}

                {loadingCategorias ? (
                    <div className="loading">Cargando categorías...</div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>

                        {/* Campo NOMBRE */}
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre <span className="required">*</span></label>
                            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} disabled={loading} required maxLength={100} className={getErrorClass('nombre')} />
                            {validationErrors.nombre && <small className="error-text">{validationErrors.nombre}</small>}
                        </div>

                        {/* Campo PRECIO */}
                        <div className="form-group">
                            <label htmlFor="precio">Precio (CLP) <span className="required">*</span></label>
                            <div className="price-input">
                                <span className="currency">$</span>
                                <input type="number" id="precio" name="precio" step="1" min="0" value={formData.precio} onChange={handleChange} disabled={loading} required className={getErrorClass('precio')} />
                            </div>
                            {validationErrors.precio && <small className="error-text">{validationErrors.precio}</small>}
                        </div>

                        {/* Campo DESCRIPCIÓN */}
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea id="descripcion" name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange} disabled={loading} maxLength={500} className={getErrorClass('descripcion')} />
                            <small className="char-count">{formData.descripcion.length}/500</small>
                            {validationErrors.descripcion && <small className="error-text">{validationErrors.descripcion}</small>}
                        </div>

                        {/* Campo CATEGORÍA */}
                        <div className="form-group">
                            <label htmlFor="categoria">Categoría <span className="required">*</span></label>
                            <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} disabled={loading || categorias.length === 0} required className={getErrorClass('categoria')}>
                                <option value="">-- Seleccione --</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                            {validationErrors.categoria && <small className="error-text">Debes seleccionar una categoría</small>}
                        </div>

                        {/* --- CAMPOS AÑADIDOS (Rúbrica 1.2) --- */}

                        {/* Campo STOCK */}
                        <div className="form-group">
                            <label htmlFor="stock">Stock <span className="required">*</span></label>
                            <input type="number" id="stock" name="stock" step="1" min="0" value={formData.stock} onChange={handleChange} disabled={loading} required className={getErrorClass('stock')} />
                            {validationErrors.stock && <small className="error-text">{validationErrors.stock}</small>}
                        </div>

                        {/* Campo ESTADO */}
                        <div className="form-group">
                            <label htmlFor="estado">Estado <span className="required">*</span></label>
                            <select id="estado" name="estado" value={formData.estado} onChange={handleChange} disabled={loading} required className={getErrorClass('estado')}>
                                <option value={ESTADO.ACTIVO}>Activo</option>
                                <option value={ESTADO.INACTIVO}>Inactivo</option>
                            </select>
                            {validationErrors.estado && <small className="error-text">{validationErrors.estado}</small>}
                        </div>

                        {/* Campo IMAGEN (Req 2.3) */}
                        <div className="form-group">
                            <label htmlFor="imagen">Imagen del Producto</label>
                            <input type="file" id="imagen" className="form-control" name="imagen" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" disabled={loading} />
                            {archivoImagen && <small className="form-text text-muted d-block mt-1">Archivo: {archivoImagen.name}</small>}
                            {validationErrors.imagen && <small className="error-text">{validationErrors.imagen}</small>}
                        </div>

                        {/* Botones de Acción */}
                        <div className="form-actions">
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Guardando...' : 'Crear Producto'}
                            </button>
                            <button type="button" onClick={handleCancel} disabled={loading} className="btn-secondary">
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Exportación por defecto
export default CrearProducto;