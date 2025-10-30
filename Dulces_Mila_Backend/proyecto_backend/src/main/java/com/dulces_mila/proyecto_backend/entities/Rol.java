package com.dulces_mila.proyecto_backend.entities;

/**
 * Esto es un Enum. Es como una lista fija de opciones.
 * Lo uso para que el campo 'rol' en Usuario SÓLO pueda ser una de estas 3 cosas.
 * (Es lo que pide la rúbrica: cliente, vendedor, super-admin).
 *
 * Así evito errores, como escribir "cliente" (en minúscula) o "Admin" por error.
 * Solo se puede elegir uno de estos.
 */
public enum Rol {

    // El que compra los pasteles
    CLIENTE,

    // El que trabaja en la tienda y gestiona el stock
    VENDEDOR,

    // Yo, el que administra todo (usuarios, productos, etc.)
    SUPER_ADMIN
}