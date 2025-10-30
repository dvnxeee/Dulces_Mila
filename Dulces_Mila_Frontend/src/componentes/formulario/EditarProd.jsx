import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para leer ID de URL y redirigir
// 1. Importamos las funciones necesarias de los servicios
import { getProductoPorId, updateProducto } from '../../services/ProductService';
import { listarTodas as getCategorias } from '../../services/CategoriaService';
// 2. Importamos las constantes (Asegúrate que la ruta sea correcta)
import { ESTADO } from '../../utils/Constants';
// 3. Importamos el CSS
import './EditarProd.css';

export function EditarProd() {
    // Hooks para obtener ID de URL y para navegar
    const { id } = useParams(); // Obtiene el ID del producto desde la URL
    const navigate = useNavigate();

    // --- Estados del Componente ---

    // Estado para los datos del formulario (inicializados vacíos o con valores por defecto)
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: { id: '' }, // Guardará el objeto categoría completo
        estado: ESTADO.ACTIVO, // Valor por defecto
        imagen: '' // Guardamos la URL de la imagen existente (no la editamos aquí)
    });

    // Estado para guardar la lista de categorías (para el <select>)
    const [categorias, setCategorias] = useState([]);

    // Estados para controlar la UI (carga, guardado, errores)
    const [loading, setLoading] = useState(true); // Empieza cargando los datos
    const [saving, setSaving] = useState(false); // Para deshabilitar botones al guardar
    const [error, setError] = useState(null); // Errores generales
    const [validationErrors, setValidationErrors] = useState({}); // Errores específicos de campos

    // --- Efecto para Cargar Datos Iniciales (Producto y Categorías) ---
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setLoading(true);
            setError(null);
            try {
                // 4. Cargar las categorías PRIMERO (para el select)
                const catsData = await getCategorias();
                setCategorias(catsData);

                // 5. Cargar los datos del producto específico usando el ID de la URL
                //    Llama a GET /api/productos/{id}
                const productoData = await getProductoPorId(id);

                // 6. Rellenar el formulario con los datos recibidos del backend
                setFormData({
                    nombre: productoData.nombre,
                    descripcion: productoData.descripcion || '', // Asegura que no sea null
                    precio: productoData.precio.toString(), // Convertir a string para el input
                    stock: productoData.stock.toString(), // Convertir a string
                    // Asegura que categoría sea un objeto con id, crucial para el <select>
                    categoria: productoData.categoria ? { id: productoData.categoria.id.toString() } : { id: '' },
                    estado: productoData.estado,
                    imagen: productoData.imagen || '' // Guarda la URL de la imagen actual
                });

            } catch (err) {
                console.error(`Error al cargar datos para editar producto ${id}:`, err);
                setError("No se pudo cargar la información del producto o las categorías.");
            } finally {
                setLoading(false); // Termina la carga
            }
        };

        cargarDatosIniciales(); // Ejecuta la carga
    }, [id]); // El array [id] significa: "Vuelve a ejecutar si el ID de la URL cambia"

    // --- Manejo de Cambios en el Formulario ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el campo es 'categoria', actualizamos el objeto categoría
        if (name === 'categoria') {
            setFormData(prev => ({ ...prev, categoria: { id: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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

        // 7. Preparamos los datos a enviar (con tipos correctos y solo el ID de categoría)
        const datosParaActualizar = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            precio: parseInt(formData.precio) || 0,
            stock: parseInt(formData.stock) || 0,
            estado: formData.estado,
            imagen: formData.imagen, // Mantenemos la URL de imagen existente
            // Asegúrate de enviar solo el ID de la categoría, como espera el backend
            categoria: { id: parseInt(formData.categoria.id) }
        };

        // Validación simple en frontend (opcional)
        if (!datosParaActualizar.categoria.id) {
            setValidationErrors({ categoria: "Debes seleccionar una categoría." });
            setError("Por favor, revisa los errores.");
            setSaving(false);
            return; // Detiene el envío si no hay categoría
        }


        try {
            // 8. Llama a PUT /api/productos/{id} usando el servicio
            await updateProducto(id, datosParaActualizar);

            alert("Producto actualizado exitosamente.");
            // 9. Redirige de vuelta a la lista de productos
            navigate('/administrador'); // O '/productos'

        } catch (err) {
            console.error(`Error al actualizar producto ${id}:`, err);
            // 10. Manejo de Errores (Validación 400 u otros)
            if (typeof err === 'object' && err !== null && !err.message) {
                setValidationErrors(err);
                setError("Por favor, corrija los errores en el formulario.");
            } else {
                // Si err.message existe, úsalo, si no, un mensaje genérico
                setError(err.message || "Error al actualizar el producto.");
            }
        } finally {
            setSaving(false); // Termina el estado "guardando"
        }
    };

    // Función para el botón Cancelar
    const handleCancel = () => {
        navigate('/administrador'); // Vuelve a la lista sin guardar
    };

    // Función auxiliar para clases CSS de error
    const getErrorClass = (fieldName) => {
        // Busca errores en el campo principal o en subcampos (ej: 'categoria.id')
        return validationErrors[fieldName] || (fieldName === 'categoria' && validationErrors['categoria.id']) ? 'is-invalid' : '';
    };


    // --- Renderizado Condicional (Carga y Error) ---
    if (loading) {
        return <div className="container text-center my-5"><div className="spinner-border text-primary"></div><p>Cargando datos del producto...</p></div>;
    }
    // Muestra error general solo si no hay errores de validación específicos
    if (error && !Object.keys(validationErrors).length > 0) {
        return <div className="container alert alert-danger my-5">{error}</div>;
    }

    // --- Renderizado del Formulario de Edición ---
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4><i className="bi bi-pencil-fill me-2"></i> Editar Producto (ID: {id})</h4>
                            {/* Botón Volver */}
                            <button onClick={handleCancel} className="btn btn-sm btn-light" title="Volver sin guardar">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="card-body">
                            {/* Muestra error general si existe Y hay errores de validación */}
                            {error && Object.keys(validationErrors).length > 0 &&
                                <div className="alert alert-warning py-2 small">{error}</div>}

                            <form onSubmit={handleSubmit} noValidate>

                                {/* Campo NOMBRE */}
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre <span className="text-danger">*</span></label>
                                    <input type="text" id="nombre" name="nombre" className={`form-control ${getErrorClass('nombre')}`} value={formData.nombre} onChange={handleChange} disabled={saving} required maxLength={100} />
                                    {validationErrors.nombre && <div className="invalid-feedback d-block">{validationErrors.nombre}</div>}
                                </div>

                                {/* Campo DESCRIPCIÓN */}
                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea id="descripcion" name="descripcion" rows="3" className={`form-control ${getErrorClass('descripcion')}`} value={formData.descripcion} onChange={handleChange} disabled={saving} maxLength={500} />
                                    <small className="form-text text-muted">{formData.descripcion.length}/500</small>
                                    {validationErrors.descripcion && <div className="invalid-feedback d-block">{validationErrors.descripcion}</div>}
                                </div>

                                {/* Fila PRECIO y STOCK */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="precio" className="form-label">Precio (CLP) <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input type="number" id="precio" name="precio" className={`form-control ${getErrorClass('precio')}`} value={formData.precio} onChange={handleChange} disabled={saving} required min="0" />
                                        </div>
                                        {validationErrors.precio && <div className="invalid-feedback d-block">{validationErrors.precio}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="stock" className="form-label">Stock <span className="text-danger">*</span></label>
                                        <input type="number" id="stock" name="stock" className={`form-control ${getErrorClass('stock')}`} value={formData.stock} onChange={handleChange} disabled={saving} required min="0" />
                                        {validationErrors.stock && <div className="invalid-feedback d-block">{validationErrors.stock}</div>}
                                    </div>
                                </div>

                                {/* Fila CATEGORÍA y ESTADO */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="categoria" className="form-label">Categoría <span className="text-danger">*</span></label>
                                        <select id="categoria" name="categoria" className={`form-select ${getErrorClass('categoria')}`} value={formData.categoria.id} onChange={handleChange} disabled={saving || categorias.length === 0} required>
                                            <option value="">-- Seleccione --</option>
                                            {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
                                        </select>
                                        {categorias.length === 0 && <small className="text-danger d-block mt-1">Cargando categorías...</small>}
                                        {(validationErrors.categoria || validationErrors['categoria.id']) && <div className="invalid-feedback d-block">{validationErrors.categoria?.id || validationErrors.categoria || "Seleccione una categoría"}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="estado" className="form-label">Estado <span className="text-danger">*</span></label>
                                        <select id="estado" name="estado" className={`form-select ${getErrorClass('estado')}`} value={formData.estado} onChange={handleChange} disabled={saving} required>
                                            <option value={ESTADO.ACTIVO}>Activo</option>
                                            <option value={ESTADO.INACTIVO}>Inactivo</option>
                                        </select>
                                        {validationErrors.estado && <div className="invalid-feedback d-block">{validationErrors.estado}</div>}
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="d-flex justify-content-between pt-3 border-top">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}><i className="bi bi-x-circle me-1"></i> Cancelar</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : <><i className="bi bi-check-lg me-1"></i> Guardar Cambios</>}
                                    </button>
                                </div>
                            </form>
                        </div> {/* Fin card-body */}
                    </div> {/* Fin card */}
                </div> {/* Fin col */}
            </div> {/* Fin row */}
        </div> // Fin container
    );
}

export default EditarProd; // Mantenemos el nombre EditarProd si así lo usa tu Router