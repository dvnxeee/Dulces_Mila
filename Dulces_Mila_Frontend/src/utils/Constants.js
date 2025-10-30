/**
 * Definición de los roles y estados usados en el proyecto.
 * Deben coincidir con los Enums del backend.
 */

export const ROL = {
    CLIENTE: 'CLIENTE',
    VENDEDOR: 'VENDEDOR',
    SUPER_ADMIN: 'SUPER_ADMIN'
};

export const ESTADO = {
    ACTIVO: 'ACTIVO',
    INACTIVO: 'INACTIVO'
};

// Este es el código secreto que solo los vendedores sabrán
export const CODIGO_VENDEDOR_SECRETO = 'MILA2025';