package com.tazaideal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Codigo de 6 digitos que llega por correo al registrarse. */
public record VerificarCorreoRequest(
        @NotBlank(message = "El código es obligatorio")
        @Pattern(regexp = "^\\d{6}$", message = "El código debe tener 6 dígitos")
        String codigo
) {
}
