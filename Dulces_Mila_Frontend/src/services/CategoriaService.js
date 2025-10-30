// 1. Importamos la configuración base de Axios desde Api.js
import api from './Api';

/**
 * Función para obtener la lista de todas las categorías desde el backend.
 * Llama al endpoint GET /api/categorias.
 * * @returns {Promise<Array>} Una promesa que resuelve a un array de objetos Categoria.
 */
export const listarTodas = async () => {
    try {
        // 2. Hacemos la petición GET a la ruta '/categorias'
        // (Axios automáticamente añade la base '/api' que configuramos en Api.js)
        const response = await api.get('/categorias');

        // 3. Axios devuelve los datos directamente en 'response.data'
        return response.data;

    } catch (error) {
        // 4. Si hay un error (de red, del servidor, etc.), lo mostramos en consola
        console.error("Error en CategoriaService al listar categorías:", error);

        // 5. Relanzamos el error para que el componente (Catalogo.jsx)
        //    pueda manejarlo y mostrar un mensaje al usuario.
        throw error;
    }
};

/**
 * Función para obtener una categoría por su ID.
 * Llama al endpoint GET /api/categorias/{id}.
 * @param {number} id - El ID de la categoría a obtener.
 * @returns {Promise<Object>} Una promesa que resuelve al objeto Categoria.
 */
export const obtenerCategoriaPorId = async (id) => {
    try {
        const response = await api.get(`${CATEGORIA_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error en CategoriaService al obtener categoría ${id}:`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} ${error.response.data.message || ''}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para crear una nueva categoría.
 * Llama al endpoint POST /api/categorias.
 * @param {Object} categoriaData - Objeto con los datos de la categoría (ej. { nombre: 'Nueva Cat' }).
 * @returns {Promise<Object>} Una promesa que resuelve a la categoría creada.
 */
export const crearCategoria = async (categoriaData) => {
    try {
        const response = await api.post(CATEGORIA_URL, categoriaData);
        return response.data;
    } catch (error) {
        console.error("Error en CategoriaService al crear categoría:", error);
        // Manejo específico para errores de validación (400) si el backend los devuelve
        if (error.response && error.response.status === 400) {
            throw error.response.data; // Devuelve el objeto de errores de validación
        }
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} ${error.response.data.message || ''}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};

/**
 * Función para actualizar una categoría existente.
 * Llama al endpoint PUT /api/categorias/{id}.
 * @param {number} id - El ID de la categoría a actualizar.
 * @param {Object} categoriaData - Objeto con los datos actualizados.
 * @returns {Promise<Object>} Una promesa que resuelve a la categoría actualizada.
 */
export const actualizarCategoria = async (id, categoriaData) => {
    try {
        const response = await api.put(`${CATEGORIA_URL}/${id}`, categoriaData);
        return response.data;
    } catch (error) {
        console.error(`Error en CategoriaService al actualizar categoría ${id}:`, error);
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
 * Función para eliminar una categoría.
 * Llama al endpoint DELETE /api/categorias/{id}.
 * @param {number} id - El ID de la categoría a eliminar.
 * @returns {Promise<void>} Una promesa que resuelve cuando la eliminación es exitosa.
 */
export const eliminarCategoria = async (id) => {
    try {
        // DELETE no suele devolver contenido, esperamos un 204 No Content
        await api.delete(`${CATEGORIA_URL}/${id}`);
        // No retornamos nada en caso de éxito
    } catch (error) {
        console.error(`Error en CategoriaService al eliminar categoría ${id}:`, error);
        const errorMessage = error.response
            ? `Error del servidor: ${error.response.status} ${error.response.data.message || 'Categoría no encontrada o en uso'}`
            : `Error de red: ${error.message}`;
        throw new Error(errorMessage);
    }
};