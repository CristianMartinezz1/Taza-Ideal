package com.tazaideal.dto;

import java.math.BigDecimal;
import java.util.List;

/** Una de las 3 bebidas recomendadas por la encuesta. */
public record RecomendacionResponse(
        Long productoId,
        String nombre,
        String imagenUrl,
        BigDecimal precio,
        /** Porcentaje de coincidencia (0 a 100). */
        int coincidencia,
        /** Por que se recomienda, por ejemplo "Es caliente", "Lleva chocolate". */
        List<String> razones
) {
}
