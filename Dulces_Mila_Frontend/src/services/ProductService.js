// 1. Importamos la configuración base de Axios desde Api.js
import api from './Api';

// Definimos la ruta base para los productos
const PRODUCTO_URL = '/productos';

// --- FUNCIONES CRUD BÁSICAS ---

/**
 * Función para crear un nuevo producto.
 * Llama al endpoint POST /api/productos.
 * @param {Object} productoData - Objeto con los datos del producto (nombre, precio, stock, etc.).
 * @returns {Promise<Object>} Promesa que resuelve al producto creado.
 */
export const createProducto = async (productoData) => {
    try {
        const response = await api.post(PRODUCTO_URL, productoData);
        return response.data;
    } catch (error) {
        console.error("Error en ProductService al crear producto:", error);
        // Manejo específico para errores de validación (400)
        if (error.response && error.response.status === 400) {
            throw error.response.data; // Devuelve el objeto de errores
        }
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} ${error.response.data.message || ''}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para obtener la lista de todos los productos.
 * Llama al endpoint GET /api/productos.
 * @returns {Promise<Array>} Promesa que resuelve a un array de Productos.
 */
export const getProductos = async () => {
    try {
        const response = await api.get(PRODUCTO_URL);
        return response.data;
    } catch (error) {
        console.error("Error en ProductService al listar productos:", error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para obtener un producto por su ID.
 * Llama al endpoint GET /api/productos/{id}.
 * @param {number | string} id - El ID del producto.
 * @returns {Promise<Object>} Promesa que resuelve al objeto Producto.
 */
export const getProductoPorId = async (id) => {
    try {
        const response = await api.get(`${PRODUCTO_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error en ProductService al obtener producto ${id}:`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} (Producto no encontrado?)`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para actualizar un producto existente.
 * Llama al endpoint PUT /api/productos/{id}.
 * @param {number | string} id - El ID del producto a actualizar.
 * @param {Object} productoData - Objeto con los datos actualizados.
 * @returns {Promise<Object>} Promesa que resuelve al producto actualizado.
 */
export const updateProducto = async (id, productoData) => {
    try {
        const response = await api.put(`${PRODUCTO_URL}/${id}`, productoData);
        return response.data;
    } catch (error) {
        console.error(`Error en ProductService al actualizar producto ${id}:`, error);
        if (error.response && error.response.status === 400) {
            throw error.response.data; // Errores de validación
        }
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} ${error.response.data.message || ''}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para eliminar físicamente un producto.
 * Llama al endpoint DELETE /api/productos/{id}.
 * @param {number | string} id - El ID del producto a eliminar.
 * @returns {Promise<void>} Promesa que resuelve al eliminar.
 */
export const deleteProducto = async (id) => {
    try {
        await api.delete(`${PRODUCTO_URL}/${id}`);
        // No retorna nada en éxito (204 No Content)
    } catch (error) {
        console.error(`Error en ProductService al eliminar producto ${id}:`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} (Producto no encontrado?)`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

// --- FUNCIONES DE CAMBIO DE ESTADO ---

/**
 * Función para inhabilitar un producto (cambiar estado a INACTIVO).
 * Llama al endpoint PATCH /api/productos/inhabilitar/{id}.
 * @param {number | string} id - El ID del producto.
 * @returns {Promise<Object>} Promesa que resuelve al producto actualizado.
 */
export const inhabilitarProducto = async (id) => {
    try {
        const response = await api.patch(`${PRODUCTO_URL}/inhabilitar/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error en ProductService al inhabilitar producto ${id}:`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para habilitar un producto (cambiar estado a ACTIVO).
 * Llama al endpoint PATCH /api/productos/habilitar/{id}.
 * @param {number | string} id - El ID del producto.
 * @returns {Promise<Object>} Promesa que resuelve al producto actualizado.
 */
export const habilitarProducto = async (id) => {
    try {
        const response = await api.patch(`${PRODUCTO_URL}/habilitar/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error en ProductService al habilitar producto ${id}:`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

// --- FUNCIONES DE BÚSQUEDA Y FILTRO ---

/**
 * Función para obtener productos filtrados por ID de categoría.
 * Llama al endpoint GET /api/productos/buscar/categoria/{id}.
 * @param {number | string} categoriaId - El ID de la categoría.
 * @returns {Promise<Array>} Promesa que resuelve a un array de Productos.
 */
export const getProductosPorCategoria = async (categoriaId) => {
    try {
        const response = await api.get(`${PRODUCTO_URL}/buscar/categoria/${categoriaId}`);
        return response.data;
    } catch (error) {
        console.error(`Error en ProductService al buscar por categoría ${categoriaId}:`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para buscar productos por nombre (contiene).
 * Llama al endpoint GET /api/productos/buscar/nombre?nombre={termino}.
 * @param {string} nombre - El término de búsqueda.
 * @returns {Promise<Array>} Promesa que resuelve a un array de Productos.
 */
export const buscarProductosPorNombre = async (nombre) => {
    try {
        const response = await api.get(`${PRODUCTO_URL}/buscar/nombre`, {
            params: { nombre } // Axios maneja los parámetros de URL
        });
        return response.data;
    } catch (error) {
        console.error(`Error en ProductService al buscar por nombre "${nombre}":`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

// --- FUNCIÓN DE SUBIDA DE IMAGEN ---

/**
 * Función para subir una imagen de producto.
 * Llama al endpoint POST /api/productos/upload.
 * @param {FormData} formData - Objeto FormData que contiene el archivo (ej. formData.append('file', archivo)).
 * @returns {Promise<Object>} Promesa que resuelve a un objeto con la URL de la imagen (ej. { url: '/uploads/...' }).
 */
export const uploadImage = async (formData) => {
    try {
        // Para subir archivos, cambiamos el Content-Type a 'multipart/form-data'
        const response = await api.post(`${PRODUCTO_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Devuelve { url: '...' }
    } catch (error) {
        console.error("Error en ProductService al subir imagen:", error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} ${error.response.data.error || ''}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};


/** Obtiene el número total de productos */
export const getTotalProductsCount = async () => {
    try {
        const response = await api.get(`${PRODUCTO_URL}/stats/count`);
        // ⬇️ CORRECCIÓN: Devuelve solo el número, incluso si es 0
        return response.data.count ?? 0;
    } catch (error) {
        console.error("Error obteniendo el conteo total de productos:", error);
        throw new Error("No se pudo obtener el total de productos.");
    }
};

/** Obtiene la lista (o cuenta) de productos con stock bajo (< 5) */
export const getLowStockProducts = async () => {
    try {
        const response = await api.get(`${PRODUCTO_URL}/stats/low-stock`);
        // ⬇️ CORRECCIÓN: Devuelve solo el número
        return response.data.count ?? 0;
    } catch (error) {
        console.error("Error obteniendo productos con stock bajo:", error);
        throw new Error("No se pudo obtener la lista de productos con stock bajo.");
    }
};