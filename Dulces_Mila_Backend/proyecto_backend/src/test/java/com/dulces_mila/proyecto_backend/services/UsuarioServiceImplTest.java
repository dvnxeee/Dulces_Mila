package com.dulces_mila.proyecto_backend.services;

// --- Importaciones de JUnit (para hacer @Test) ---
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.junit.jupiter.api.Assertions.*; // Para assertEquals (comparar)

// --- Importaciones de Mockito (para "fingir") ---
import org.mockito.InjectMocks; // Para inyectar los "falsos"
import org.mockito.Mock; // Para crear un objeto "falso"
import org.mockito.junit.jupiter.MockitoExtension; // Para que Mockito funcione

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*; // Para when(), verify(), etc.

import java.util.Optional;

import com.dulces_mila.proyecto_backend.entities.Estado;
import com.dulces_mila.proyecto_backend.entities.Rol;
// --- Nuestras clases ---
import com.dulces_mila.proyecto_backend.entities.Usuario;
import com.dulces_mila.proyecto_backend.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Esta anotación "activa" Mockito para esta clase de prueba.
 */
@ExtendWith(MockitoExtension.class)
public class UsuarioServiceImplTest {

    // --- ¿Qué son @Mock y @InjectMocks? ---

    /**
     * @Mock crea una versión "falsa" (un mock) de esta clase.
     * No usaremos el repositorio real (no hay base de datos),
     * solo fingiremos su comportamiento.
     */
    @Mock
    private UsuarioRepository usuarioRepo;

    /**
     * @Mock también para el encriptador.
     */
    @Mock
    private PasswordEncoder passwordEncoder;

    /**
     * @InjectMocks crea una instancia real de UsuarioServiceImpl,
     * pero automáticamente le "inyecta" (como un @Autowired)
     * las versiones falsas (@Mock) de usuarioRepo y passwordEncoder.
     *
     * ESTA ES LA CLASE QUE VAMOS A TESTEAR.
     */
    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    // --- FIN DE LA CONFIGURACIÓN ---

    /**
     * ---- TEST 1 de 3: Probar el método 'save' (crear) ----
     * El objetivo es verificar que la contraseña SÍ se está encriptando
     * antes de llamar al repositorio.
     */
    @Test
    public void testCrearUsuario_DebeEncriptarContraseña() {

        // 1. GIVEN (Dado / Preparación)
        // Este es el usuario que "llegaría" desde el controlador
        Usuario usuarioSinEncriptar = new Usuario();
        usuarioSinEncriptar.setNombre("Usuario de Prueba");
        usuarioSinEncriptar.setEmail("prueba@test.com");
        usuarioSinEncriptar.setContraseña("passwordPlana123"); // Contraseña en texto plano

        String hashEsperado = "hash_encriptado_ABC_123"; // La contraseña "falsa" ya encriptada

        // --- Le enseñamos a los "Mocks" (falsos) cómo comportarse ---
        
        // 1.1. Cuando alguien llame a passwordEncoder.encode("passwordPlana123"),
        //      entonces... devuelve "hash_encriptado_ABC_123".
        when(passwordEncoder.encode("passwordPlana123")).thenReturn(hashEsperado);

        // 1.2. Cuando alguien llame a usuarioRepo.save(CUALQUIER Usuario),
        //      entonces... solo devuelve el mismo usuario que te pasaron.
        //      (Usamos any() porque el usuario que recibe save ya tiene la fecha y estado)
        when(usuarioRepo.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));


        // 2. WHEN (Cuando / Ejecución)
        // Llamamos al método que queremos probar
        Usuario usuarioGuardado = usuarioService.save(usuarioSinEncriptar);


        // 3. THEN (Entonces / Verificación)
        
        // 3.1. Verificamos que el usuario devuelto SÍ tenga la contraseña encriptada
        assertNotNull(usuarioGuardado); // Que no sea nulo
        assertEquals(hashEsperado, usuarioGuardado.getContraseña()); // ¡El test clave!
        
        // 3.2. (Opcional pero bueno) Verificamos que los métodos "falsos"
        //      hayan sido llamados exactamente 1 vez.
        
        // Verifica que el método .encode() se llamó 1 vez
        verify(passwordEncoder, times(1)).encode("passwordPlana123");
        
        // Verifica que el método .save() se llamó 1 vez
        verify(usuarioRepo, times(1)).save(any(Usuario.class));
    }

    /**
     * ---- TEST 2 de 3: Probar el método 'login' (caso exitoso) ----
     * El objetivo es verificar que un usuario con email, contraseña
     * y estado correctos puede iniciar sesión.
     */
    @Test
    public void testLoginExitoso() {
        
        // 1. GIVEN (Dado / Preparación)
        String email = "admin@mila.com";
        String passwordPlana = "clave123";
        String passwordEncriptada = "$2a$10$abcdefghi..."; // Contraseña encriptada en la "BD"

        // 1.1. Creamos el usuario tal como estaría en la base de datos
        Usuario usuarioDeLaBD = new Usuario();
        usuarioDeLaBD.setId(1L);
        usuarioDeLaBD.setEmail(email);
        usuarioDeLaBD.setContraseña(passwordEncriptada); // <- La encriptada
        usuarioDeLaBD.setRol(Rol.SUPER_ADMIN);
        usuarioDeLaBD.setEstado(Estado.ACTIVO); // <- Está ACTIVO

        // --- Le enseñamos a los "Mocks" cómo comportarse ---
        
        // 1.2. Cuando alguien llame a usuarioRepo.findByEmail("admin@mila.com"),
        //      entonces... devuelve nuestro usuario de la BD (envuelto en un Optional).
        when(usuarioRepo.findByEmail(email)).thenReturn(Optional.of(usuarioDeLaBD));

        // 1.3. Cuando alguien llame a passwordEncoder.matches("clave123", "$2a$10$abcdefghi..."),
        //      entonces... devuelve 'true' (las contraseñas coinciden).
        when(passwordEncoder.matches(passwordPlana, passwordEncriptada)).thenReturn(true);


        // 2. WHEN (Cuando / Ejecución)
        // Llamamos al método que queremos probar
        Optional<Usuario> resultadoLogin = usuarioService.login(email, passwordPlana);


        // 3. THEN (Entonces / Verificación)
        
        // 3.1. Verificamos que el resultado NO esté vacío
        assertTrue(resultadoLogin.isPresent(), "El login debería ser exitoso");
        
        // 3.2. Verificamos que el usuario devuelto sea el correcto
        assertEquals(email, resultadoLogin.get().getEmail());
        assertEquals(Rol.SUPER_ADMIN, resultadoLogin.get().getRol());

        // 3.3. Verificamos que los mocks fueron llamados
        verify(usuarioRepo, times(1)).findByEmail(email);
        verify(passwordEncoder, times(1)).matches(passwordPlana, passwordEncriptada);
    }

    /**
     * ---- TEST 3 de 3: Probar el método 'login' (falla por contraseña) ----
     * El objetivo es verificar que si el email es correcto pero la
     * contraseña no lo es, el login falla (devuelve Optional vacío).
     */
    @Test
    public void testLoginFallaPorContraseña() {
        
        // 1. GIVEN (Dado / Preparación)
        String email = "admin@mila.com";
        String passwordIncorrecta = "clave_INCORRECTA_456"; // La que manda el usuario
        String passwordEncriptada = "$2a$10$abcdefghi..."; // La que está en la BD
        
        // 1.1. Creamos el usuario tal como estaría en la base de datos
        Usuario usuarioDeLaBD = new Usuario();
        usuarioDeLaBD.setId(1L);
        usuarioDeLaBD.setEmail(email);
        usuarioDeLaBD.setContraseña(passwordEncriptada);
        usuarioDeLaBD.setEstado(Estado.ACTIVO); // Está ACTIVO

        // --- Le enseñamos a los "Mocks" cómo comportarse ---

        // 1.2. Cuando alguien llame a usuarioRepo.findByEmail,
        //      entonces... SÍ lo encuentra.
        when(usuarioRepo.findByEmail(email)).thenReturn(Optional.of(usuarioDeLaBD));

        // 1.3. Cuando alguien llame a passwordEncoder.matches(la_incorrecta, la_correcta),
        //      entonces... devuelve 'false' (las contraseñas NO coinciden).
        when(passwordEncoder.matches(passwordIncorrecta, passwordEncriptada)).thenReturn(false);

        // 2. WHEN (Cuando / Ejecución)
        // Llamamos al método que queremos probar
        Optional<Usuario> resultadoLogin = usuarioService.login(email, passwordIncorrecta);

        // 3. THEN (Entonces / Verificación)
        
        // 3.1. Verificamos que el resultado SÍ esté vacío
        assertTrue(resultadoLogin.isEmpty(), "El login debería fallar y devolver un Optional vacío");

        // 3.2. Verificamos que los mocks fueron llamados
        verify(usuarioRepo, times(1)).findByEmail(email);
        verify(passwordEncoder, times(1)).matches(passwordIncorrecta, passwordEncriptada);
    }
}