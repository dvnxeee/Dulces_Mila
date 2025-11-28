package com.dulces_mila.proyecto_backend.security;

import com.dulces_mila.proyecto_backend.entities.Usuario;
import com.dulces_mila.proyecto_backend.repositories.UsuarioRepository; 
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    // Inyección de dependencias
    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscamos al usuario por su email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        // Convertimos el Rol a un formato que Spring Security entienda (GrantedAuthority)
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()));

        // Retornamos un objeto User de Spring Security con los datos de tu usuario
        return new User(
                usuario.getEmail(),       // Usamos el email como nombre de usuario
                usuario.getContraseña(),  // La contraseña encriptada de la BD
                usuario.getEstado() == com.dulces_mila.proyecto_backend.entities.Estado.ACTIVO, // enabled (true si ACTIVO)
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities // Los roles/permisos
        );
    }
}