package com.dulces_mila.proyecto_backend.services;

import com.dulces_mila.proyecto_backend.dto.CompraRequest;
import com.dulces_mila.proyecto_backend.entities.DetalleVenta;
import com.dulces_mila.proyecto_backend.entities.Producto;
import com.dulces_mila.proyecto_backend.entities.Usuario;
import com.dulces_mila.proyecto_backend.entities.Venta;
import com.dulces_mila.proyecto_backend.repositories.ProductoRepository;
import com.dulces_mila.proyecto_backend.repositories.UsuarioRepository;
import com.dulces_mila.proyecto_backend.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Constante para el IVA (19%)
    private static final double IVA = 0.19;

    @Override
    @Transactional // Importante: Si algo falla, se deshacen todos los cambios (rollback)
    public Venta realizarVenta(String emailUsuario, CompraRequest compraRequest) {
        
        // Buscar al usuario que está comprando
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear la Venta vacía por ahora
        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setFecha(LocalDateTime.now());
        
        List<DetalleVenta> detalles = new ArrayList<>();
        long totalVenta = 0;

        // Procesar cada producto del carrito
        for (CompraRequest.ItemCompra item : compraRequest.getItems()) {
            
            // Buscar el producto en la BD
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado ID: " + item.getProductoId()));

            // Validar Stock (Regla de Negocio Crítica)
            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // Descontar Stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto); // Guardar el nuevo stock

            // Crear el Detalle de Venta
            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio()); // Guardamos el precio actual
            
            // Calcular subtotal de este ítem
            long subtotal = producto.getPrecio() * item.getCantidad();
            detalle.setSubtotal(subtotal);
            
            // Vincular detalle con la venta
            detalle.setVenta(venta);
            
            // Agregarlo a la lista
            detalles.add(detalle);
            
            // Sumar al total acumulado
            totalVenta += subtotal;
        }

        // Calcular Totales Finales (Neto, IVA, Total)
        // En Chile, el precio de venta suele incluir IVA. 
        // Si tus precios son brutos (con IVA incluido):
        long totalPagar = totalVenta;
        long montoNeto = Math.round(totalPagar / 1.19);
        long montoIva = totalPagar - montoNeto;

        venta.setMontoNeto(montoNeto);
        venta.setMontoIva(montoIva);
        venta.setTotal(totalPagar);
        venta.setDetalles(detalles);

        // Guardar la Venta (por Cascada se guardan los detalles)
        return ventaRepository.save(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> obtenerVentasPorUsuario(String email) {
        return ventaRepository.findByUsuarioEmail(email);
    }
}