package com.tazaideal.dto;

import com.tazaideal.model.EstadoPedido;
import com.tazaideal.model.Pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String codigo,
        EstadoPedido estado,
        ClienteResumen cliente,
        LocalDateTime horaRecogida,
        String notas,
        BigDecimal total,
        LocalDateTime creadoEn,
        LocalDateTime actualizadoEn,
        /** Lineas del pedido. Es null en los listados para no cargar el detalle de todos. */
        List<ItemPedidoResponse> items
) {

    public record ClienteResumen(Long id, String nombre, String telefono) {
    }

    /** Version para listados (sin lineas). */
    public static PedidoResponse resumen(Pedido p) {
        return crear(p, null);
    }

    /** Version completa con las lineas (cargar el pedido con findConDetalleById). */
    public static PedidoResponse conDetalle(Pedido p) {
        return crear(p, p.getDetalles().stream().map(ItemPedidoResponse::de).toList());
    }

    private static PedidoResponse crear(Pedido p, List<ItemPedidoResponse> items) {
        return new PedidoResponse(
                p.getId(),
                p.getCodigo(),
                p.getEstado(),
                new ClienteResumen(p.getUsuario().getId(), p.getUsuario().getNombre(), p.getUsuario().getTelefono()),
                p.getHoraRecogida(),
                p.getNotas(),
                p.getTotal(),
                p.getCreadoEn(),
                p.getActualizadoEn(),
                items);
    }
}
