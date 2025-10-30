package com.dulces_mila.proyecto_backend.services;

import com.dulces_mila.proyecto_backend.entities.Estado;
import com.dulces_mila.proyecto_backend.entities.Usuario;
import com.dulces_mila.proyecto_backend.repositories.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // <-- Importamos el Encriptador
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // <-- Importamos la Fecha
import java.util.List;
import java.util.Optional;

// Anoto esta clase como un servicio para que Spring la detecte
@Service
public class UsuarioServiceImpl implements UsuarioService {

    // Inyecto el repositorio de usuarios
    @Autowired
    private UsuarioRepository usuarioRepo;

    // Inyecto el "Encriptador de contraseñas" que configuramos en SecurityConfig
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true) // Método de solo lectura
    public List<Usuario> findAll() {
        // Devuelve todos los usuarios
        return (List<Usuario>) usuarioRepo.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> findAllActivos() {
        // Uso el método nuevo del repo para traer solo los 'ACTIVOS'
        return usuarioRepo.findByEstado(Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Long id) {
        // Busca un usuario por ID
        return usuarioRepo.findById(id);
    }

    @Override
    @Transactional // Este método SÍ modifica la BD
    public Usuario save(Usuario usuario) {

        // 1. Poner la fecha de creación del sistema
        usuario.setFechaCreacion(LocalDateTime.now());

        // 2. Poner el estado por defecto
        usuario.setEstado(Estado.ACTIVO);

        // 3. ¡ENCRIPTAR LA CONTRASEÑA!
        usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));

        // 4. Guardo el usuario (nuevo) y retorno el objeto
        return usuarioRepo.save(usuario);
    }

    @Override
    @Transactional
    public Optional<Usuario> update(Long id, Usuario nuevosDatos) {
        // 1. Busco al usuario por ID
        return usuarioRepo.findById(id).map(usuarioDb -> {
            // 2. Si lo encuentro, actualizo sus datos
            usuarioDb.setNombre(nuevosDatos.getNombre());
            usuarioDb.setEmail(nuevosDatos.getEmail());
            usuarioDb.setRol(nuevosDatos.getRol());
            usuarioDb.setEstado(nuevosDatos.getEstado());

            // 3. Lógica para actualizar contraseña (solo si se escribió una nueva)
            if (nuevosDatos.getContraseña() != null && !nuevosDatos.getContraseña().isEmpty()) {
                // Si escribió una nueva, la encripto
                usuarioDb.setContraseña(passwordEncoder.encode(nuevosDatos.getContraseña()));
            }

            // 4. Guardo los cambios y retorno el usuario actualizado
            return usuarioRepo.save(usuarioDb);
        }); // 'map' devuelve un Optional, así que no necesito 'orElse(null)'
    }

    @Override
    @Transactional
    public Optional<Usuario> inhabilitar(Long id) {
        // 1. Busco el usuario por ID
        return usuarioRepo.findById(id).map(usuario -> {
            // 2. Si lo encuentro, cambio su estado a INACTIVO
            usuario.setEstado(Estado.INACTIVO);
            // 3. Persisto (guardo) el cambio
            return usuarioRepo.save(usuario);
        });
    }

    /**
     * Habilita (reactiva) un usuario.
     */
    @Override
    @Transactional
    public Optional<Usuario> habilitar(Long id) {
        // 1. Busco el usuario por ID
        return usuarioRepo.findById(id).map(usuario -> {
            // 2. Si lo encuentro, cambio su estado a ACTIVO
            usuario.setEstado(Estado.ACTIVO);
            // 3. Persisto (guardo) el cambio
            return usuarioRepo.save(usuario);
        });
    }

    @Override
    @Transactional
    public Optional<Usuario> delete(Long id) {
        // 1. Intento buscar el usuario por su ID
        Optional<Usuario> usuarioOpcional = usuarioRepo.findById(id);

        // 2. Si el usuario existe, lo elimino
        usuarioOpcional.ifPresent(usuarioDb -> {
            usuarioRepo.deleteById(id);
        });

        // 3. Retorno el usuario (que ahora está borrado)
        return usuarioOpcional;
    }

    /**
     * Lógica para el login.
     */
    @Override
    @Transactional(readOnly = true) // Es de solo lectura
    public Optional<Usuario> login(String email, String contraseña) {

        // 1. Buscamos al usuario por email
        Optional<Usuario> usuarioOpcional = usuarioRepo.findByEmail(email);

        // 2. Si no lo encontramos, devolvemos vacío (login falla)
        if (usuarioOpcional.isEmpty()) {
            return Optional.empty();
        }

        // 3. Si lo encontramos, sacamos el usuario
        Usuario usuario = usuarioOpcional.get();

        // 4. Verificamos que esté ACTIVO
        if (usuario.getEstado() == Estado.INACTIVO) {
            return Optional.empty(); // Usuario inactivo, login falla
        }

        // 5. Comparamos las contraseñas
        //    passwordEncoder.matches( [la que mandó el user] , [la encriptada en BD] )
        if (passwordEncoder.matches(contraseña, usuario.getContraseña())) {
            // ¡Las contraseñas coinciden! Devolvemos el usuario.
            return usuarioOpcional;
        }

        // 6. Si las contraseñas no coinciden, devolvemos vacío
        return Optional.empty();
    }

    @Override
    @Transactional(readOnly = true)
    public long contarTotalUsuarios() {
        // Llama al nuevo método del repositorio
        return usuarioRepo.count(); 
    }
}