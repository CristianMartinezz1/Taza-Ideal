package com.tazaideal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 60, message = "El nombre debe tener entre 2 y 60 caracteres")
        String nombre,

        @Size(max = 255, message = "La descripción no puede pasar de 255 caracteres")
        String descripcion,

        Boolean activo
) {
}
