package com.tazaideal.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

/** Pedido que confirma el cliente desde el carrito. */
public record PedidoRequest(
        @NotEmpty(message = "El carrito está vacío")
        @Size(max = 20, message = "Máximo 20 productos por pedido")
        List<@Valid ItemPedidoRequest> items,

        @Future(message = "La hora de recogida debe ser futura")
        LocalDateTime horaRecogida,

        @Size(max = 255, message = "Las notas no pueden pasar de 255 caracteres")
        String notas
) {
}
