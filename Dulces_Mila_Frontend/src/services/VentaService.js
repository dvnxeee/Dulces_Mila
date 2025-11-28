// src/services/VentaService.js
import api from './Api';

const VENTAS_URL = '/ventas';

/**
 * Envía el carrito al backend para procesar la compra.
 * Llama a POST /api/ventas
 * * @param {Array} itemsCarrito - Lista de items del carrito local [{id, cantidad}, ...]
 * @returns {Promise<Object>} La venta creada (boleta)
 */
export const realizarVenta = async (itemsCarrito) => {
    try {
        // Transformamos el carrito al formato que espera el Backend (CompraRequest)
        // El backend espera: { "items": [ { "productoId": 1, "cantidad": 2 }, ... ] }
        const itemsParaBackend = itemsCarrito.map(prod => ({
            productoId: prod.id,
            cantidad: prod.cantidad
        }));

        const payload = {
            items: itemsParaBackend
        };

        // Hacemos la petición POST
        const response = await api.post(VENTAS_URL, payload);
        return response.data;

    } catch (error) {
        console.error("Error al realizar la venta:", error);
        const errorMessage = error.response 
            ? error.response.data.message || error.response.data.error || "Error al procesar la venta."
            : "Error de conexión.";
        throw new Error(errorMessage);
    }
};

/**
 * Obtiene el historial de compras del usuario logueado.
 * Llama a GET /api/ventas/mis-compras
 */
export const getMisCompras = async () => {
    try {
        const response = await api.get(`${VENTAS_URL}/mis-compras`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener historial:", error);
        throw new Error("No se pudo cargar el historial de compras.");
    }
};