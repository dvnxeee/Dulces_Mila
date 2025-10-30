package com.dulces_mila.proyecto_backend.entities;

/**
 * Este es igual que el Rol, pero para el estado.
 * Un usuario (o un producto) solo puede estar ACTIVO o INACTIVO.
 *
 * Sirve para el requisito de la rúbrica de "Eliminar/Inhabilitar".
 * En vez de borrar un usuario de la base de datos (DELETE),
 * solo lo pongo como INACTIVO.
 */
public enum Estado {

    // El usuario puede entrar al sistema. El producto (pastel) se puede vender.
    ACTIVO,

    // El usuario no puede entrar. El producto no aparece en la tienda.
    INACTIVO
}