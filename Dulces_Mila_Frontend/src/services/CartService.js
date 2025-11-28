import api from './Api';

const CART_KEY = 'dulcesMilaCart';

// --- Helper para saber si estamos en modo "Nube" o "Local" ---
const isUserLoggedIn = () => {
    const token = localStorage.getItem('token'); // O verifica 'user' en localStorage
    return !!token; // Devuelve true si hay token
};

// --- FUNCIONES DEL CARRITO (Híbridas) ---

/**
 * Obtiene el carrito (desde API o LocalStorage)
 */
export const getCart = async () => {
    if (isUserLoggedIn()) {
        try {
            // MODO NUBE: Pedimos el carrito a la base de datos
            const response = await api.get('/carrito');
            // El backend devuelve un objeto Carrito con una lista 'items'. 
            // Mapeamos para que tenga el formato simple que usa tu frontend:
            // [{ id, nombre, precio, cantidad, imagen, stock }, ...]
            return response.data.items.map(item => ({
                ...item.producto, // Datos del producto
                cantidad: item.cantidad // Cantidad en el carrito
            }));
        } catch (error) {
            console.error("Error al cargar carrito de la nube:", error);
            return []; // Retorna vacío si falla
        }
    } else {
        // MODO LOCAL: Leemos de localStorage
        return new Promise((resolve) => {
            const cartData = localStorage.getItem(CART_KEY);
            resolve(cartData ? JSON.parse(cartData) : []);
        });
    }
};

/**
 * Agrega un ítem (a la API o LocalStorage)
 */
export const addItemToCart = async (producto, cantidad) => {
    if (isUserLoggedIn()) {
        try {
            // MODO NUBE: Enviamos al backend
            await api.post('/carrito/agregar', {
                productoId: producto.id,
                cantidad: cantidad
            });
            // Despachamos evento para actualizar Navbar
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Error al guardar en la nube:", error);
            alert("Error al sincronizar el carrito.");
        }
    } else {
        // MODO LOCAL: Lógica original de localStorage
        return new Promise((resolve) => {
            const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            const existingItemIndex = cart.findIndex(item => item.id === producto.id);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].cantidad += cantidad;
            } else {
                cart.push({ ...producto, cantidad: cantidad });
            }
            
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
            resolve(cart);
        });
    }
};

/**
 * Elimina un ítem (de la API o LocalStorage)
 */
export const removeItemFromCart = async (productoId) => {
    if (isUserLoggedIn()) {
        try {
            // MODO NUBE
            await api.delete(`/carrito/eliminar/${productoId}`);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Error al eliminar de la nube:", error);
        }
    } else {
        // MODO LOCAL
        return new Promise((resolve) => {
            let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            cart = cart.filter(item => item.id !== productoId);
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
            resolve(cart);
        });
    }
};

/**
 * Vacía el carrito (en API o LocalStorage)
 */
export const clearCart = async () => {
    if (isUserLoggedIn()) {
        try {
            // MODO NUBE
            await api.delete('/carrito/vaciar');
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Error al vaciar carrito nube:", error);
        }
    } else {
        // MODO LOCAL
        return new Promise((resolve) => {
            localStorage.removeItem(CART_KEY);
            window.dispatchEvent(new Event('cartUpdated'));
            resolve();
        });
    }
};

/**
 * Cuenta ítems para el Navbar
 */
export const getCartItemCount = async () => {
    // Reutilizamos getCart para no duplicar lógica
    const items = await getCart();
    return items.reduce((total, item) => total + item.cantidad, 0);
};