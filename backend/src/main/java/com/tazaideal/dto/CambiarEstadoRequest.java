package com.tazaideal.dto;

import com.tazaideal.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

/** Nuevo estado de un pedido (barista o administrador). */
public record CambiarEstadoRequest(
        @NotNull(message = "El estado es obligatorio")
        EstadoPedido estado
) {
}
