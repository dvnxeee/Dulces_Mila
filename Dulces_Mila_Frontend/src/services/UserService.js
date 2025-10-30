import api from './Api'; // Importa la instancia de Axios

const USER_URL = '/usuarios';

// --- LOGIN ---
export const login = async (email, contraseña) => {
    try {
        const response = await api.post(`${USER_URL}/login`, { email, contraseña });
        return response.data;
    } catch (error) {
        // Lanza el mensaje de error específico del backend (ej. "Credenciales incorrectas")
        const errorMessage = error.response ? error.response.data.error : "Error de conexión.";
        throw errorMessage;
    }
};

// --- CRUD ---

/** 1. LEER TODOS (GET /api/usuarios) */
export const getAllUsers = async () => {
    try {
        const response = await api.get(USER_URL);
        return response.data;
    } catch (error) {
        console.error("Error en UserService (getAllUsers):", error);
        throw new Error("No se pudo cargar la lista de usuarios.");
    }
};

/** 2. LEER UNO POR ID (GET /api/usuarios/{id}) */
export const getUserById = async (id) => {
    try {
        const response = await api.get(`${USER_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error en UserService (getUserById ${id}):`, error);
        throw new Error("No se pudo cargar el usuario.");
    }
};

/** 3. CREAR USUARIO (POST /api/usuarios) */
export const createUser = async (userData) => {
    try {
        // Llama al endpoint del backend que ya probamos
        const response = await api.post(USER_URL, userData);
        return response.data;
    } catch (error) {
        console.error("Error en UserService (createUser):", error);
        // Si el backend devuelve errores de validación (400)
        if (error.response && error.response.status === 400) {
            // Lanza el objeto de errores (ej: {nombre: "...", email: "..."})
            throw error.response.data;
        }
        // Lanza un error general
        throw new Error("No se pudo crear el usuario. ¿El email ya existe?");
    }
};

/** 4. ACTUALIZAR USUARIO (PUT /api/usuarios/{id}) */
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`${USER_URL}/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error en UserService (updateUser ${id}):`, error);
        if (error.response && error.response.status === 400) {
            throw error.response.data;
        }
        throw new Error("No se pudo actualizar el usuario.");
    }
};

/** 5. INHABILITAR USUARIO (PATCH /api/usuarios/inhabilitar/{id}) */
export const inhabilitarUser = async (id) => {
    try {
        const response = await api.patch(`${USER_URL}/inhabilitar/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error en UserService (inhabilitarUser ${id}):`, error);
        throw new Error("No se pudo inhabilitar el usuario.");
    }
};

/** 6. HABILITAR USUARIO (PATCH /api/usuarios/habilitar/{id}) */
export const habilitarUser = async (id) => {
    try {
        const response = await api.patch(`${USER_URL}/habilitar/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error en UserService (habilitarUser ${id}):`, error);
        throw new Error("No se pudo habilitar el usuario.");
    }
};

/** 7. ELIMINAR USUARIO (DELETE /api/usuarios/{id}) */
export const deleteUser = async (id) => {
    try {
        await api.delete(`${USER_URL}/${id}`);
    } catch (error) {
        console.error(`Error en UserService (deleteUser ${id}):`, error);
        throw new Error("No se pudo eliminar el usuario.");
    }
};

/** Obtiene el número total de usuarios registrados */
export const getTotalUsersCount = async () => {
    try {
        const response = await api.get(`${USER_URL}/stats/count`);
        // ⬇️ CORRECCIÓN: Devuelve solo el número
        return response.data.count ?? 0;
    } catch (error) {
        console.error("Error obteniendo el conteo total de usuarios:", error);
        throw new Error("No se pudo obtener el total de usuarios.");
    }
};