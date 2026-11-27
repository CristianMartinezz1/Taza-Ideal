package com.tazaideal.dto;

import jakarta.validation.constraints.*;

/** Una linea del carrito. El precio NO se recibe: lo pone el servidor. */
public record ItemPedidoRequest(
        @NotNull(message = "Falta el producto")
        Long productoId,

        @Min(value = 1, message = "La cantidad mínima es 1")
        @Max(value = 20, message = "La cantidad máxima es 20")
        int cantidad,

        @Pattern(regexp = "^(Chico|Mediano|Grande)$", message = "Tamaño no válido")
        String tamano,

        @Size(max = 30, message = "Tipo de leche no válido")
        String leche
) {
}
