package com.tazaideal.dto;

import com.tazaideal.model.DetallePedido;

import java.math.BigDecimal;

public record ItemPedidoResponse(
        Long productoId,
        String producto,
        String imagenUrl,
        int cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal,
        String tamano,
        String leche
) {

    public static ItemPedidoResponse de(DetallePedido d) {
        return new ItemPedidoResponse(
                d.getProducto().getId(),
                d.getProducto().getNombre(),
                d.getProducto().getImagenUrl(),
                d.getCantidad(),
                d.getPrecioUnitario(),
                d.getSubtotal(),
                d.getTamano(),
                d.getLeche());
    }
}
