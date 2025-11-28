package com.dulces_mila.proyecto_backend.dto;

import java.util.List;

// Esta clase representa lo que envía el carrito al pagar
public class CompraRequest {
    
    // Solo necesitamos saber qué productos quiere y cuántos
    private List<ItemCompra> items;

    public List<ItemCompra> getItems() { return items; }
    public void setItems(List<ItemCompra> items) { this.items = items; }

    // Clase interna para cada ítem del carrito
    public static class ItemCompra {
        private Long productoId;
        private Integer cantidad;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}