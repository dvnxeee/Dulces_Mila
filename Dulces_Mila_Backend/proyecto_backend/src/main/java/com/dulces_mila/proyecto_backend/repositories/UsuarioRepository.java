package com.dulces_mila.proyecto_backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dulces_mila.proyecto_backend.entities.Estado;
import com.dulces_mila.proyecto_backend.entities.Usuario;

/**
 * Esta interfaz es el Repositorio (DAO) para la entidad Usuario.
 * * Al extender JpaRepository, Spring Data JPA nos da gratis
 * todos los métodos CRUD básicos (save, findById, findAll, delete, etc.)
 * para la entidad 'Usuario' (que tiene un ID de tipo 'Long').
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Este método personalizado permite buscar un usuario por su 'email'.
     * Spring crea la consulta automáticamente basándose en el nombre del método.
     * * Lo vamos a necesitar sí o sí para el Requisito 1.4 (Endpoint de login),
     * para validar si el email que nos dan existe en la base de datos.
     * * Usamos 'Optional' porque el usuario puede existir o no (así evitamos
     * errores de 'null').
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Este método devuelve únicamente los usuarios que tienen un estado específico.
     * Es la versión del "findByActivadoTrue" de tu ejemplo, pero
     * adaptado a nuestro Enum 'Estado'.
     * Lo usaremos para buscar todos los usuarios 'ACTIVOS'.
     */
    List<Usuario> findByEstado(Estado estado);

    // ⬇️ MÉTODO NUEVO PARA CONTAR ⬇️
    /**
     * Cuenta el número total de usuarios registrados.
     * Spring Data JPA genera la consulta "SELECT count(*) FROM usuarios".
     * 
     * @return El número total de usuarios.
     */
    long count();

}