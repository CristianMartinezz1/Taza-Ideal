package com.tazaideal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Cambio de contrasena desde el perfil (pide la actual). */
public record CambiarContrasenaRequest(
        @NotBlank(message = "Escribe tu contraseña actual")
        String contrasenaActual,

        @NotBlank(message = "La contraseña nueva es obligatoria")
        @Pattern(regexp = Validaciones.CONTRASENA, message = Validaciones.CONTRASENA_MSG)
        String contrasenaNueva
) {
}
