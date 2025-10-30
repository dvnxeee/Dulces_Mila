package com.dulces_mila.proyecto_backend.services;

import com.dulces_mila.proyecto_backend.entities.Usuario;
import java.util.List;
import java.util.Optional;

/**
 * Esta es la interfaz del servicio de Usuario.
 * Aquí defino los métodos que el servicio debe implementar
 * para manejar la lógica de negocio (el CRUD).
 */
public interface UsuarioService {

    /**
     * Este método devuelve una lista con todos los usuarios registrados.
     */
    List<Usuario> findAll();

    /**
     * Este método devuelve únicamente los usuarios que están 'ACTIVOS'.
     * (Equivalente a tu 'findAllActive').
     */
    List<Usuario> findAllActivos();

    /**
     * Este método busca un usuario por su ID.
     * Retorna un Optional para manejar de forma segura si el usuario existe o no.
     */
    Optional<Usuario> findById(Long id);

    /**
     * Este método guarda un NUEVO usuario.
     * Se usa solo para 'Crear'.
     * La lógica de 'Actualizar' está en 'update'.
     */
    Usuario save(Usuario usuario);

    /**
     * Este método actualiza un usuario existente, identificado por su ID.
     */
    Optional<Usuario> update(Long id, Usuario usuario);

    /**
     * Este método "inhabilita" un usuario, cambiando su 'estado' a INACTIVO.
     * Esto cumple con el requisito de "Eliminar/Inhabilitar" de la rúbrica.
     * (Equivalente a tu 'desactivate').
     */
    Optional<Usuario> inhabilitar(Long id);

    /**
     * Este método "habilita" (o reactiva) un usuario, cambiando su 'estado' a
     * ACTIVO.
     * Es el opuesto de 'inhabilitar'.
     */
    Optional<Usuario> habilitar(Long id); // <-- NUEVO MÉTODO

    /**
     * Este método elimina físicamente un usuario de la base de datos.
     * (Opcional, pero completa el CRUD).
     */
    Optional<Usuario> delete(Long id);

    /**
     * Valida las credenciales de un usuario.
     * Devuelve el usuario si el email y contraseña son correctos
     * y el usuario está ACTIVO.
     */
    Optional<Usuario> login(String email, String contraseña);

    /** Obtiene el conteo total de usuarios. */
    long contarTotalUsuarios(); // NUEVO
}