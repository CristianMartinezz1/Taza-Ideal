package com.tazaideal.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Set;

/** Alta y edicion de productos. La foto se sube aparte (multipart). */
public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        String nombre,

        @Size(max = 500, message = "La descripción no puede pasar de 500 caracteres")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "1.00", message = "El precio debe ser mayor a 0")
        @Digits(integer = 8, fraction = 2, message = "El precio debe tener máximo 2 decimales")
        BigDecimal precio,

        @NotNull(message = "La categoría es obligatoria")
        Long categoriaId,

        Boolean disponible,

        /** Ids de las etiquetas de sabor (relacion N:M). */
        Set<Long> etiquetaIds
) {
}
