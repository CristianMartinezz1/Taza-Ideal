package com.tazaideal.dto;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

/** Respuesta paginada igual para todos los listados (menu, usuarios, pedidos...). */
public record PaginaResponse<T>(
        List<T> contenido,
        int pagina,
        int tamano,
        long totalElementos,
        int totalPaginas,
        boolean primera,
        boolean ultima
) {

    /** Convierte una pagina de entidades a una pagina de DTOs. */
    public static <E, T> PaginaResponse<T> de(Page<E> pagina, Function<E, T> convertir) {
        return new PaginaResponse<>(
                pagina.getContent().stream().map(convertir).toList(),
                pagina.getNumber(),
                pagina.getSize(),
                pagina.getTotalElements(),
                pagina.getTotalPages(),
                pagina.isFirst(),
                pagina.isLast());
    }
}
