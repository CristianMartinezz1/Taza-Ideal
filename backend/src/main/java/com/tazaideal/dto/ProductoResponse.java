package com.tazaideal.dto;

import com.tazaideal.model.Producto;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        String imagenUrl,
        boolean disponible,
        CategoriaResumen categoria,
        List<EtiquetaResponse> etiquetas
) {

    /** Solo lo necesario de la categoria para mostrarla en la tarjeta del producto. */
    public record CategoriaResumen(Long id, String nombre) {
    }

    public static ProductoResponse de(Producto p) {
        return new ProductoResponse(
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getImagenUrl(),
                p.isDisponible(),
                new CategoriaResumen(p.getCategoria().getId(), p.getCategoria().getNombre()),
                p.getEtiquetas().stream()
                        .sorted(Comparator.comparing(e -> e.getNombre()))
                        .map(EtiquetaResponse::de)
                        .toList());
    }
}
