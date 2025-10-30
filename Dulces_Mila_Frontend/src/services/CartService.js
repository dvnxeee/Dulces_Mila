const CART_KEY = 'dulcesMilaCart'; // Clave para guardar el carrito en localStorage

/**
 * Obtiene el carrito de compras desde localStorage.
 * @returns {Array} Un array de objetos de producto con sus cantidades.
 */
export const getCart = () => {
    try {
        const cartData = localStorage.getItem(CART_KEY);
        // Si hay datos, los parsea. Si no, devuelve un array vacío.
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error("Error al leer el carrito desde localStorage:", error);
        return [];
    }
};

/**
 * Guarda el carrito de compras en localStorage.
 * @param {Array} cartItems - El array de productos a guardar.
 */
export const saveCart = (cartItems) => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        // Opcional: Despachar un evento para que el Navbar pueda escucharlo
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        console.error("Error al guardar el carrito en localStorage:", error);
    }
};

/**
 * Añade un producto al carrito o actualiza su cantidad.
 * @param {Object} product - El objeto del producto a añadir.
 * @param {number} quantity - La cantidad a añadir.
 */
export const addItemToCart = (product, quantity) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // Si el producto ya existe, actualiza la cantidad
        cart[existingItemIndex].cantidad += quantity;
    } else {
        // Si es un producto nuevo, lo añade
        cart.push({ ...product, cantidad: quantity });
    }
    saveCart(cart);
};

/**
 * Elimina un producto completamente del carrito.
 * @param {number} productId - El ID del producto a eliminar.
 */
export const removeItemFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
};

/**
 * Limpia todo el carrito de compras.
 */
export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    // Despachar el evento para que el Navbar se actualice
    window.dispatchEvent(new Event('cartUpdated'));
};

/**
 * Obtiene el número total de ítems únicos o el total de la suma de cantidades.
 * @param {boolean} countTotalQuantity - Si es true, suma las cantidades; si es false, cuenta ítems únicos.
 * @returns {number} El número total de ítems.
 */
export const getCartItemCount = (countTotalQuantity = true) => {
    const cart = getCart();
    if (countTotalQuantity) {
        return cart.reduce((total, item) => total + item.cantidad, 0);
    }
    return cart.length; // Cuenta solo la cantidad de productos diferentes
};