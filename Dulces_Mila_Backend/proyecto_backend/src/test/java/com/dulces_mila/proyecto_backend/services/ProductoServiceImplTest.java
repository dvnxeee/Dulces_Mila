package com.dulces_mila.proyecto_backend.services;

// --- Importaciones de JUnit y Mockito ---
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// --- Nuestras clases ---
import com.dulces_mila.proyecto_backend.entities.Producto;
import com.dulces_mila.proyecto_backend.entities.Categoria;
import com.dulces_mila.proyecto_backend.entities.Estado;
import com.dulces_mila.proyecto_backend.repositories.ProductoRepository;
import com.dulces_mila.proyecto_backend.repositories.CategoriaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceImplTest {

    // --- Configuración ---

    /**
     * @Mock: "Fingimos" los dos repositorios que usa el servicio.
     * No hay base de datos real.
     */
    @Mock
    private ProductoRepository productoRepository;
    
    @Mock
    private CategoriaRepository categoriaRepository;

    /**
     * @InjectMocks: Creamos una instancia REAL de ProductoServiceImpl,
     * pero le "inyectamos" los repositorios falsos de arriba.
     *
     * ESTA ES LA CLASE QUE VAMOS A TESTEAR.
     */
    @InjectMocks
    private ProductoServiceImpl productoService;

    // --- Fin Configuración ---

    /**
     * ---- TEST 1 de 4: Probar el método 'crear' ----
     * El objetivo es verificar que la lógica que agregamos
     * (poner fecha y estado) funcione correctamente.
     */
    @Test
    public void testCrearProducto_DebeEstablecerFechaYEstado() {

        // 1. GIVEN (Dado / Preparación)
        // Este es el producto que "llegaría" del controlador
        Producto productoSinGuardar = new Producto();
        productoSinGuardar.setNombre("Torta de Prueba");
        productoSinGuardar.setPrecio(10000L);
        productoSinGuardar.setStock(10);
        productoSinGuardar.setEstado(null); // Lo ponemos null a propósito
        productoSinGuardar.setCategoria(new Categoria()); // Le ponemos una categoría

        // --- Le enseñamos al "Mock" cómo comportarse ---
        
        // 1.1. Cuando alguien llame a productoRepository.save(CUALQUIER Producto),
        //      entonces... devuelve el mismo producto que te pasaron.
        when(productoRepository.save(any(Producto.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. WHEN (Cuando / Ejecución)
        // Llamamos al método que queremos probar
        Producto productoGuardado = productoService.crear(productoSinGuardar);

        // 3. THEN (Entonces / Verificación)
        
        // 3.1. Verificamos que el producto guardado NO sea nulo
        assertNotNull(productoGuardado);
        
        // 3.2. ¡El test clave! Verificamos que la fecha se haya puesto
        assertNotNull(productoGuardado.getFechaCreacion());
        // Verificamos que la fecha sea de "ahora" (o muy reciente)
        assertTrue(productoGuardado.getFechaCreacion().isBefore(LocalDateTime.now().plusSeconds(1)));

        // 3.3. ¡El otro test clave! Verificamos que el estado se puso en ACTIVO
        assertEquals(Estado.ACTIVO, productoGuardado.getEstado());

        // 3.4. Verificamos que el repositorio falso fue llamado 1 vez
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    /**
     * ---- TEST 2 de 4: Probar el método 'inhabilitar' ----
     * El objetivo es verificar que el estado del producto
     * cambia correctamente a INACTIVO.
     */
    @Test
    public void testInhabilitarProducto_DebeCambiarEstadoAInactivo() {

        // 1. GIVEN (Dado / Preparación)
        Long productoId = 1L;

        // 1.1. Creamos un producto "falso" que simula estar en la BD
        Producto productoActivo = new Producto();
        productoActivo.setId(productoId);
        productoActivo.setNombre("Torta Activa");
        productoActivo.setEstado(Estado.ACTIVO); // <- Su estado actual

        // --- Le enseñamos a los "Mocks" cómo comportarse ---
        
        // 1.2. Cuando alguien llame a productoRepository.findById(1L),
        //      entonces... devuelve nuestro producto (envuelto en un Optional).
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(productoActivo));

        // 1.3. Cuando alguien llame a productoRepository.save(CUALQUIER Producto),
        //      entonces... solo devuelve el mismo producto que le pasaron.
        when(productoRepository.save(any(Producto.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. WHEN (Cuando / Ejecución)
        // Llamamos al método que queremos probar
        Producto productoInhabilitado = productoService.inhabilitar(productoId);

        // 3. THEN (Entonces / Verificación)
        
        // 3.1. Verificamos que el producto devuelto NO sea nulo
        assertNotNull(productoInhabilitado);
        
        // 3.2. ¡El test clave! Verificamos que el estado ahora es INACTIVO
        assertEquals(Estado.INACTIVO, productoInhabilitado.getEstado());

        // 3.3. Verificamos que el repositorio falso fue llamado
        verify(productoRepository, times(1)).findById(productoId); // Se llamó 1 vez a buscar
        verify(productoRepository, times(1)).save(any(Producto.class)); // Se llamó 1 vez a guardar
    }

    /**
     * ---- TEST 3 de 4: Probar el método 'buscarPorCategoria' ----
     * El objetivo es verificar que el servicio primero busca la categoría
     * y luego busca los productos usando esa categoría.
     */
    @Test
    public void testBuscarPorCategoria_DebeDevolverProductosDeEsaCategoria() {
        
        // 1. GIVEN (Dado / Preparación)
        Long categoriaId = 5L;

        // 1.1. Creamos una categoría "falsa"
        Categoria categoriaTortas = new Categoria();
        categoriaTortas.setId(categoriaId);
        categoriaTortas.setNombre("Tortas");

        // 1.2. Creamos una lista "falsa" de productos
        Producto torta1 = new Producto();
        torta1.setId(10L);
        torta1.setNombre("Torta de Chocolate");
        torta1.setCategoria(categoriaTortas);

        Producto torta2 = new Producto();
        torta2.setId(11L);
        torta2.setNombre("Torta de Mil Hojas");
        torta2.setCategoria(categoriaTortas);
        
        List<Producto> listaDeTortas = List.of(torta1, torta2);

        // --- Le enseñamos a los "Mocks" cómo comportarse ---

        // 1.3. Cuando alguien llame a categoriaRepository.findById(5L),
        //      entonces... devuelve nuestra categoría "falsa".
        when(categoriaRepository.findById(categoriaId)).thenReturn(Optional.of(categoriaTortas));

        // 1.4. Cuando alguien llame a productoRepository.findByCategoria(categoriaTortas),
        //      entonces... devuelve nuestra lista "falsa" de tortas.
        when(productoRepository.findByCategoria(categoriaTortas)).thenReturn(listaDeTortas);


        // 2. WHEN (Cuando / Ejecución)
        // Llamamos al método que queremos probar
        List<Producto> resultadoBusqueda = productoService.buscarPorCategoria(categoriaId);


        // 3. THEN (Entonces / Verificación)
        
        // 3.1. Verificamos que el resultado NO sea nulo y tenga 2 productos
        assertNotNull(resultadoBusqueda);
        assertEquals(2, resultadoBusqueda.size());

        // 3.2. Verificamos que los nombres sean los correctos
        assertEquals("Torta de Chocolate", resultadoBusqueda.get(0).getNombre());

        // 3.3. Verificamos que los mocks fueron llamados
        verify(categoriaRepository, times(1)).findById(categoriaId); // Se buscó la categoría 1 vez
        verify(productoRepository, times(1)).findByCategoria(categoriaTortas); // Se buscaron los productos 1 vez
    }

    /**
     * ---- TEST 4 de 4: Probar el método 'buscarPorNombre' ----
     * El objetivo es verificar que el servicio llama al método
     * correcto del repositorio ('findByNombreContainingIgnoreCase').
     */
    @Test
    public void testBuscarPorNombre_DebeDevolverProductosQueCoincidan() {
        
        // 1. GIVEN (Dado / Preparación)
        String terminoDeBusqueda = "Torta";

        // 1.1. Creamos una lista "falsa" de productos que coinciden
        Producto torta1 = new Producto();
        torta1.setId(10L);
        torta1.setNombre("Torta de Chocolate");

        Producto torta2 = new Producto();
        torta2.setId(11L);
        torta2.setNombre("Torta de Mil Hojas");
        
        List<Producto> listaDeTortas = List.of(torta1, torta2);

        // --- Le enseñamos al "Mock" cómo comportarse ---

        // 1.2. Cuando alguien llame al repositorio con el término "Torta"
        //      (ignorando mayúsculas/minúsculas),
        //      entonces... devuelve nuestra lista "falsa".
        when(productoRepository.findByNombreContainingIgnoreCase(terminoDeBusqueda))
            .thenReturn(listaDeTortas);


        // 2. WHEN (Cuando / Ejecución)
        // Llamamos al método que queremos probar
        List<Producto> resultadoBusqueda = productoService.buscarPorNombre(terminoDeBusqueda);


        // 3. THEN (Entonces / Verificación)
        
        // 3.1. Verificamos que el resultado NO sea nulo y tenga 2 productos
        assertNotNull(resultadoBusqueda);
        assertEquals(2, resultadoBusqueda.size());

        // 3.2. Verificamos que el nombre del primer producto sea el correcto
        assertEquals("Torta de Chocolate", resultadoBusqueda.get(0).getNombre());

        // 3.3. Verificamos que el mock fue llamado
        verify(productoRepository, times(1))
            .findByNombreContainingIgnoreCase(terminoDeBusqueda);
    }
}