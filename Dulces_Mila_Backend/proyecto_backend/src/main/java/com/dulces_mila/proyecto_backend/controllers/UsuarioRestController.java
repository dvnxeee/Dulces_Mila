package com.dulces_mila.proyecto_backend.controllers;

import com.dulces_mila.proyecto_backend.dto.LoginRequest;
import com.dulces_mila.proyecto_backend.entities.Usuario;
import com.dulces_mila.proyecto_backend.services.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

// Importaciones para Validación
import jakarta.validation.Valid;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Este es el Controlador REST para la entidad Usuario.
 * Maneja las peticiones HTTP (JSON) y se conecta con el Frontend (React).
 */
@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Operaciones CRUD sobre usuarios")
// ¡Importante! Necesitarás esto para que React se pueda conectar
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioRestController {

    @Autowired // Inyecto el servicio que tiene toda la lógica
    private UsuarioService usuarioService;

    @Operation(summary = "Listar todos los usuarios (activos e inactivos)")
    @GetMapping
    public List<Usuario> listar() {
        // Llama directo al servicio
        return usuarioService.findAll();
    }

    @Operation(summary = "Listar solo los usuarios ACTIVO")
    @GetMapping("/activos")
    public List<Usuario> listarActivos() {
        // Llama directo al servicio
        return usuarioService.findAllActivos();
    }

    @Operation(summary = "Obtener un usuario por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> verDetalle(@PathVariable Long id) {
        // El servicio nos da un Optional, lo "mapeamos" a la respuesta
        return usuarioService.findById(id)
                .map(usuario -> ResponseEntity.ok(usuario)) // Si lo encuentra -> 200 OK
                .orElse(ResponseEntity.notFound().build()); // Si no -> 404 Not Found
    }

    @Operation(summary = "Crear un nuevo usuario")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario creado"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody Usuario usuario) {
        // 1. @Valid -> Activa las validaciones (del Requisito 1.1)
        // 2. @RequestBody -> Toma el JSON y lo vuelve un objeto Usuario
        // 3. Llama al servicio 'save' que ya tiene la encriptación y la fecha
        Usuario nuevoUsuario = usuarioService.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @Operation(summary = "Actualizar un usuario existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> modificar(@PathVariable Long id, @RequestBody Usuario usuario) {
        // Llamamos a nuestro servicio 'update'.
        // Toda la lógica (encriptar si es necesario, etc.) ya está en el servicio.
        return usuarioService.update(id, usuario)
                .map(usuarioActualizado -> ResponseEntity.ok(usuarioActualizado)) // 200 OK
                .orElse(ResponseEntity.notFound().build()); // 404 Not Found
    }

    @Operation(summary = "Inhabilitar un usuario (cambio de estado a INACTIVO)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario inhabilitado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PatchMapping("/inhabilitar/{id}") // Uso PATCH porque es un cambio parcial
    public ResponseEntity<Usuario> inhabilitar(@PathVariable Long id) {
        return usuarioService.inhabilitar(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Habilitar (reactivar) un usuario (cambio de estado a ACTIVO)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario habilitado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PatchMapping("/habilitar/{id}") // Uso PATCH porque es un cambio parcial
    public ResponseEntity<Usuario> habilitar(@PathVariable Long id) {
        return usuarioService.habilitar(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ---- ENDPOINT DE LOGIN (CORREGIDO) ----
     * Valida credenciales para CUALQUIER rol (Cliente, Vendedor, Admin).
     * El frontend se encargará de la redirección.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        // 1. Llama al servicio de login (esto ya valida contraseña y estado ACTIVO)
        Optional<Usuario> usuarioOpcional = usuarioService.login(
            loginRequest.getEmail(),
            loginRequest.getContraseña()
        );

        // 2. Verificamos si el login falló
        if (usuarioOpcional.isEmpty()) {
            // Si está vacío, las credenciales están mal o el user está inactivo
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Credenciales incorrectas o usuario inactivo"));
        }

        // 3. ¡Login Exitoso!
        // Devolvemos el usuario (sea CLIENTE o ADMIN) al frontend.
        Usuario usuario = usuarioOpcional.get();
        return ResponseEntity.ok(usuario);
    }

    /**
     * Endpoint para obtener estadísticas de usuarios.
     * GET /api/usuarios/stats/count
     */
    @GetMapping("/stats/count")
    public ResponseEntity<Map<String, Long>> getStatsCount() {
        long total = usuarioService.contarTotalUsuarios();
        // Devolvemos un JSON simple: { "count": N }
        return ResponseEntity.ok(Map.of("count", total));
    }

    // --- Manejador de Excepciones para @Valid ---
    /**
     * Esto cumple con "Validaciones en el... controlador".
     * Captura los errores de @Valid y los devuelve como un JSON
     * en lugar de un error feo.
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Devuelve 400 Bad Request
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}