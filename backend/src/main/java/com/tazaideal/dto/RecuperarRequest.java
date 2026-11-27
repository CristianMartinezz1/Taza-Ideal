package com.tazaideal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Solicitud de enlace para restablecer la contrasena. */
public record RecuperarRequest(
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        String correo
) {
}
