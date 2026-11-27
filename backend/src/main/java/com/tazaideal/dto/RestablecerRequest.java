package com.tazaideal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Nueva contrasena usando el token que llego por correo. */
public record RestablecerRequest(
        @NotBlank(message = "El enlace no es válido")
        String token,

        @NotBlank(message = "La contraseña es obligatoria")
        @Pattern(regexp = Validaciones.CONTRASENA, message = Validaciones.CONTRASENA_MSG)
        String contrasenaNueva
) {
}
