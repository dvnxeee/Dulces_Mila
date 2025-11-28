package com.dulces_mila.proyecto_backend.auth;

import com.dulces_mila.proyecto_backend.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dulces_mila.proyecto_backend.repositories.UsuarioRepository;
import com.dulces_mila.proyecto_backend.entities.Usuario;

import org.springframework.http.HttpStatus; // Necesario para errores

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService; // (Lo mantenemos para validar)
    private final JwtUtils jwtUtils;
    private final UsuarioRepository usuarioRepository; // ⬅️ Agregamos el repo

    // Inyectamos el repositorio en el constructor
    public AuthController(AuthenticationManager am, UserDetailsService uds, JwtUtils jwt, UsuarioRepository ur) {
        this.authManager = am;
        this.userDetailsService = uds;
        this.jwtUtils = jwt;
        this.usuarioRepository = ur;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        Usuario usuario = usuarioRepository.findByEmail(request.email()).orElseThrow();

        // Generamos AMBOS tokens
        String accessToken = jwtUtils.generateToken(usuario.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(usuario.getEmail());

        // Devolvemos ambos tokens en la respuesta
        return ResponseEntity.ok(new AuthResponse(
                accessToken,
                refreshToken,
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getRol().name()));
    }

    // NUEVO ENDPOINT: Refrescar Token
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.refreshToken();

        // Validamos el refresh token
        if (refreshToken != null && jwtUtils.validateToken(refreshToken)) {

            // Extraemos el usuario
            String username = jwtUtils.getUsernameFromToken(refreshToken);

            // Generamos un NUEVO Access Token (corto)
            String newAccessToken = jwtUtils.generateToken(username);

            // Devolvemos el nuevo token (podemos devolver solo el token o la estructura
            // completa)
            // Para simplificar, devolvemos una estructura similar o un mapa simple
            return ResponseEntity.ok(java.util.Map.of("token", newAccessToken));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Refresh token inválido o expirado");
    }

}