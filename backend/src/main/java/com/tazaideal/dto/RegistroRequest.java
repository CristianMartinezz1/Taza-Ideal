package com.tazaideal.dto;

import jakarta.validation.constraints.*;

/** Datos para crear una cuenta de cliente. */
public record RegistroRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        @Size(max = 150, message = "El correo es demasiado largo")
        String correo,

        @NotBlank(message = "La contraseña es obligatoria")
        @Pattern(regexp = Validaciones.CONTRASENA, message = Validaciones.CONTRASENA_MSG)
        String contrasena,

        @Pattern(regexp = Validaciones.TELEFONO, message = Validaciones.TELEFONO_MSG)
        String telefono,

        @AssertTrue(message = "Debes aceptar los términos y la política de privacidad")
        boolean aceptaTerminos
) {
}
